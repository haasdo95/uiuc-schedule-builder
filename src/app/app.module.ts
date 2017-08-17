import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ScheduleModule } from 'primeng/primeng'

import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AutocompleteHintsComponent } from './autocomplete-hints/autocomplete-hints.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ScheduleComponent,
    AutocompleteHintsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ScheduleModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
