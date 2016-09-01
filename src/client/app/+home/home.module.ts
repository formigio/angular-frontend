import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home.component';
import { GoalListService } from '../shared/goal-list/index';

@NgModule({
    imports: [CommonModule, SharedModule],
    declarations: [HomeComponent],
    exports: [HomeComponent],
    providers: [GoalListService]
})

export class HomeModule { }
