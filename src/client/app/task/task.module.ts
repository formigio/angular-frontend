import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { TaskItemComponent, TaskListComponent, TaskService } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [TaskItemComponent, TaskListComponent],
    exports: [TaskItemComponent, TaskListComponent],
    providers: [TaskService]
})

export class TaskModule { }
