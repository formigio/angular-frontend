import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    providers: []
})

export class HomeModule { }
