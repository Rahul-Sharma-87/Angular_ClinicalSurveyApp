import { Component, OnInit } from '@angular/core';

import { ClinicalTrialService } from '../services/ClinicalTrial.service';
// import { HelperService } from '../services/helper.service';
import { Option, Question, Survey, Surveyconfig } from '../models/index';
import {Popup} from 'ng2-opd-popup';

@Component({
  selector: 'app-Survey',
  templateUrl: './ClinicalTrial.component.html',
  styleUrls: ['./ClinicalTrial.component.css'],
  providers: [ClinicalTrialService]
})
export class ClinicalTrialComponent implements OnInit {
  surveys: any[];
  survey: Survey = new Survey(null);
  mode: string = 'Survey';
  surveyName: string;
  config: Surveyconfig = {
    'allowBack': true,
    'allowReview': true,
    'autoMove': false,  // if true, it will move to next question automatically when answered.
    'duration': 0,  // indicates the time in which Survey needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': false,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': false,
    'shuffleOptions': false,
    'showClock': false,
    'showPager': true,
    'theme': 'none'
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(private SurveyService: ClinicalTrialService, private popup:Popup) {
    this.popup.options = {
      header: "Informed Consent",
      color: "blue",
      widthProsentage: 100, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: "I Disagree", // The text on your confirm button
      cancleBtnContent: "I Agree", // the text on your cancel button
      confirmBtnClass: "btn btn-default", // your class for styling the confirm button
      cancleBtnClass: "btn btn-default", // you class for styling the cancel button
      animation: "fadeInDown" // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
  }

  ngOnInit() {
    this.surveys = this.SurveyService.getAll();
    this.surveyName = this.surveys[0].id;
    this.loadSurvey(this.surveyName);
  }

  loadSurvey(SurveyName: string) {
    this.mode = 'Survey';
    this.popup.show()
    this.SurveyService.get(SurveyName).subscribe(res => {
      this.survey = new Survey(res);
      this.pager.count = this.survey.questions.length;
    });
  }

  get filteredQuestions() {
    return (this.survey.questions) ?
      this.survey.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'Survey';
    }
  }

  isAnswered(index) {
    if(this.survey.questions[index].options.find(x => x.selected)) {
      return 'Answered: '+ this.survey.questions[index].options.filter(x => x.selected)[0].name;
    }
    return 'Not-Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    this.survey.questions.forEach(x => answers.push({ 'SurveyId': this.survey.id, 'QuestionId': x.id, 'Answered': x.answered }));
    console.log(this.survey.questions);
    this.mode = 'result';
  }

  onDisAgreeClick() {
    this.mode = 'Disagree';
    this.popup.hide();
  }

  showPanel() {
    if(this.mode != 'result' && this.mode !='Disagree') {
      return true;
    }
    return false;
  }
  
}
