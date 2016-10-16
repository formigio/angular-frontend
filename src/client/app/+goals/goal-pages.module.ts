import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { GoalsPageComponent, GoalPageComponent, GoalReadonlyComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule],
    declarations: [ GoalsPageComponent, GoalPageComponent, GoalReadonlyComponent ],
    exports: [ GoalsPageComponent ]
})

export class GoalPagesModule { }
