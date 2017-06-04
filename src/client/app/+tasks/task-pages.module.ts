import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { TaskModule } from '../task/task.module';
import { TaskPageComponent, TasksPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, TaskModule],
    declarations: [ TaskPageComponent, TasksPageComponent ],
    exports: [ TaskPageComponent, TasksPageComponent ]
})

export class TaskPagesModule { }
