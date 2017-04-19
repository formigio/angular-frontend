import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { TeamMemberService, TeamMemberNotifyComponent } from '../team-member/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [TeamMemberNotifyComponent],
    exports: [TeamMemberNotifyComponent],
    providers: [TeamMemberService]
})

export class TeamMemberModule { }
