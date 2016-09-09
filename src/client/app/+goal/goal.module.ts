import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoalComponent } from './goal.component';
import { GoalListService, GoalService } from '../shared/goal/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [GoalComponent],
    exports: [GoalComponent],
    providers: [GoalListService,GoalService]
})

export class GoalModule { }
