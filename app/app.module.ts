import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent }  from './app.component';
import { ListFormComponent }  from './list-form.component';

@NgModule({
  imports: [ 
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    ListFormComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
