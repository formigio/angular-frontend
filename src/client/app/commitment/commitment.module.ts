import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import {
    CommitmentItemComponent,
    CommitmentListComponent,
    WorkerCommitmentItemComponent,
    WorkerCommitmentListComponent
} from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [
        CommitmentItemComponent,
        CommitmentListComponent,
        WorkerCommitmentItemComponent,
        WorkerCommitmentListComponent
    ],
    exports: [CommitmentListComponent, WorkerCommitmentListComponent],
    providers: []
})
export class CommitmentModule {}
