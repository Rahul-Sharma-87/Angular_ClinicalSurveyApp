import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {PopupModule} from 'ng2-opd-popup';

import { AppComponent } from './app.component';
import { ClinicalTrialComponent } from './ClinicalTrial/ClinicalTrial.component';

@NgModule({
  declarations: [
    AppComponent,
    ClinicalTrialComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PopupModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
