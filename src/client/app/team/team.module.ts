import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { TeamService } from '../team/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [],
    exports: [],
    providers: [TeamService]
})

export class TeamModule { }
