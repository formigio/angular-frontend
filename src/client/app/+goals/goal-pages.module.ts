import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { GoalsPageComponent } from './index';

@NgModule({
    imports: [SharedModule],
    declarations: [ GoalsPageComponent ],
    exports: [ GoalsPageComponent ]
})

export class GoalPagesModule { }
