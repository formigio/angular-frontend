import { Component } from '@angular/core';
import { GoalWorkerComponent } from '../../goal/index';
import { TaskWorkerComponent } from '../../task/index';
import { RouteWorkerComponent } from '../../shared/index';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-process',
  templateUrl: 'process.component.html',
  directives: [GoalWorkerComponent, TaskWorkerComponent, RouteWorkerComponent]
})
export class ProcessComponent {

}
