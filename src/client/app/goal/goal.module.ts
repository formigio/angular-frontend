import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GoalService } from '../goal/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [],
    exports: [],
    providers: [GoalService]
})

export class GoalModule { }