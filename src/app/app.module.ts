import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent }  from './app.component';
import { keygeneratorComponent } from './keygenerator/keygenerator.component';

const routes:Routes=[
  {path: "", component: keygeneratorComponent}
];

@NgModule({
  imports:      [ BrowserModule, ReactiveFormsModule, RouterModule.forRoot(routes) ],
  declarations: [ AppComponent, keygeneratorComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
