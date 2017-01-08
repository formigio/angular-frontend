import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { InviteModule } from '../invite/invite.module';
import { InvitesPageComponent, InvitePageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, InviteModule],
    declarations: [
        InvitesPageComponent,
        InvitePageComponent
        ],
    exports: [
        InvitesPageComponent,
        InvitePageComponent
        ]
})

export class InvitePagesModule { }
