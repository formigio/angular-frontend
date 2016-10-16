import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { InviteItemComponent, InviteListComponent, InviteService } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [InviteItemComponent, InviteListComponent],
    exports: [InviteListComponent],
    providers: [InviteService]
})

export class InviteModule { }
