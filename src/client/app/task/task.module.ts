import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CoreModule } from '../core/core.module';
import { TaskItemComponent, TaskListComponent } from './index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule, CoreModule],
    declarations: [TaskItemComponent,TaskListComponent],
    exports: [TaskListComponent],
    providers: []
})
export class TaskModule {}
