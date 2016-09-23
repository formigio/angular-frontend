import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoalComponent } from './goal.component';
import { GoalService } from '../goal/index';
import { TaskService } from '../task/index';
import { InviteService } from '../invite/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [GoalComponent],
    exports: [GoalComponent],
    providers: [GoalService, TaskService, InviteService]
})

export class GoalModule { }
