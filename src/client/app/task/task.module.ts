import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

import { TaskItemComponent, TaskListComponent, TaskCommitFormComponent } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [TaskItemComponent,TaskListComponent,TaskCommitFormComponent],
    exports: [TaskListComponent],
    providers: []
})
export class TaskModule {}
