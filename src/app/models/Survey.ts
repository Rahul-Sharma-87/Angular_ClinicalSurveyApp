import { Surveyconfig } from './Survey-config';
import { Question } from './question';

export class Survey {
    id: number;
    name: string;
    description: string;
    config: Surveyconfig;
    questions: Question[];

    constructor(data: any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.config = new Surveyconfig(data.config);
            this.questions = [];
            data.questions.forEach(q => {
                this.questions.push(new Question(q));
            });
        }
    }
}
