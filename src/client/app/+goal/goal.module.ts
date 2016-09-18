import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoalComponent } from './goal.component';
import { GoalViewComponent } from './goal-view.component';
import { GoalService, TaskService } from '../shared/goal/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [GoalComponent, GoalViewComponent],
    exports: [GoalComponent, GoalViewComponent],
    providers: [GoalService, TaskService]
})

export class GoalModule { }
