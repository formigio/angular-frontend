import { Component } from '@angular/core';
import { TeamWorkerComponent } from '../../team/index';
import { GoalWorkerComponent } from '../../goal/index';
import { TaskWorkerComponent } from '../../task/index';
import { InviteWorkerComponent } from '../../invite/index';
import { RouteWorkerComponent } from '../../shared/index';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-process',
  templateUrl: 'process.component.html',
  directives: [TeamWorkerComponent, GoalWorkerComponent, TaskWorkerComponent, InviteWorkerComponent, RouteWorkerComponent]
})
export class ProcessComponent {

}
