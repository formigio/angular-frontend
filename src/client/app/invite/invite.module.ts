import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { InviteItemComponent, InviteListComponent, InviteService } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [InviteItemComponent, InviteListComponent],
    exports: [InviteItemComponent, InviteListComponent],
    providers: [InviteService]
})

export class InviteModule { }
