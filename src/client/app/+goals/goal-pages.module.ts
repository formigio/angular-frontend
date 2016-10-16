import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { TaskModule } from '../task/task.module';
import { InviteModule } from '../invite/invite.module';
import { GoalsPageComponent, GoalPageComponent, GoalReadonlyComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule, TaskModule, InviteModule],
    declarations: [ GoalsPageComponent, GoalPageComponent, GoalReadonlyComponent ],
    exports: [ GoalsPageComponent, GoalPageComponent, GoalReadonlyComponent ]
})

export class GoalPagesModule { }
