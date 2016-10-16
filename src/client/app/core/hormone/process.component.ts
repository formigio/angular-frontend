import { Component } from '@angular/core';
import { GoalWorkerComponent } from '../../goal/index';
import { TaskWorkerComponent } from '../../task/index';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-process',
  templateUrl: 'process.component.html',
  directives: [GoalWorkerComponent, TaskWorkerComponent]
})
export class ProcessComponent {

}
