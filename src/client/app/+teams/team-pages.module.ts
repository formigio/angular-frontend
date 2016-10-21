import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { GoalModule } from '../goal/goal.module';
import { TeamsPageComponent, TeamPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, GoalModule],
    declarations: [
        TeamsPageComponent,
        TeamPageComponent
        ],
    exports: [
        TeamsPageComponent,
        TeamPageComponent
        ]
})

export class TeamPagesModule { }
