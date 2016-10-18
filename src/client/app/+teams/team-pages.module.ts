import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import {
    TeamsPageComponent
    // ,
    // GoalPageComponent,
    } from './index';

@NgModule({
    imports: [SharedModule, CoreModule],
    declarations: [
        TeamsPageComponent
        // ,
        // GoalPageComponent
        ],
    exports: [
        TeamsPageComponent
        // , GoalPageComponent, GoalReadonlyComponent
        ]
})

export class TeamPagesModule { }
