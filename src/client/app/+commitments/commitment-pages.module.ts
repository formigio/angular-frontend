import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { CommitmentModule } from '../commitment/commitment.module';
import { CommitmentsPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, CommitmentModule ],
    declarations: [ CommitmentsPageComponent ],
    exports: [ CommitmentsPageComponent ]
})

export class CommitmentPagesModule { }
