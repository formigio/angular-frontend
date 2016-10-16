import { Component, Input } from '@angular/core';
import { TaskService, Task } from './index';
import { MessageService } from '../core/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-item',
  templateUrl: 'task-item.component.html',
  providers: [ ]
})

export class TaskItemComponent {

  @Input() task:Task;
  @Input() editable: boolean;

  errorMessage: string = '';
  success: string = '';
  state: string = 'view';
  response: any;

  /**
   *
   * @param
   */
  constructor(
    protected service: TaskService,
    protected message: MessageService
  ) {}

  makeEditable() {
    this.state = 'edit';
  }

  persistTask() {
    this.state='view';
    this.saveTask(this.task);
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTask(task:Task) {
    task.deleted = true;
    this.message.startProcess('task_delete',{task:task});
    // this.service.removeTask(task);
    // this.process.initProcess('task_delete',{task:task});
    // this.service.delete(task)
    //   .subscribe(
    //     success => this.success,
    //     error => this.errorMessage = <any>error,
    //     () => this.task.uuid = ''
    //   );
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  saveTask(task:Task): boolean {
    this.service.put(task)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  completeTask(task:Task): boolean {
    task.complete = 'true';
    this.service.put(task)
      .subscribe(
        res => this.response = res,
        error => this.errorMessage = <any>error,
        () => this.message.setFlash('Task Saved.','success')
      );
    return false;
  }

}
