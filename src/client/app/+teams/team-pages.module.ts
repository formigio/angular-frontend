import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { InviteModule } from '../invite/invite.module';
import { GoalModule } from '../goal/goal.module';
import { TeamMemberModule } from '../team-member/team-member.module';
import { TeamsPageComponent, TeamPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, InviteModule, GoalModule, TeamMemberModule],
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
