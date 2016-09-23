import { Component, Input } from '@angular/core';
import { TaskService, Task } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-list',
  templateUrl: 'task-list.component.html',
  // providers: [ TaskService ]
})

export class TaskListComponent {

  @Input() task:Task;

  errorMessage: string = '';

  /**
   *
   * @param 
   */
  constructor(
      // public service: TaskService
  ) {}

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // deleteTask(task:Task): boolean {
  //   this.service.delete(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // saveTask(task:Task): boolean {
  //   this.service.put(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // completeTask(task:Task): boolean {
  //   task.complete = 'true';
  //   this.service.put(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

}
