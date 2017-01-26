import { Component, Input, OnInit } from '@angular/core';
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

export class TaskItemComponent implements OnInit {

  @Input() task:Task;
  @Input() editable: boolean;

  state: string = 'view';
  response: any;
  showNotes: boolean = false;

  /**
   *
   * @param
   */
  constructor(
    protected service: TaskService,
    protected message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    if(!this.task.id) {
      this.message.startProcess('task_create',{task:this.task});
    }
  }

  makeEditable() {
    this.state = 'edit';
    // this.showNotes = true;
    // this.task.notes = this.task.notes.split('|').join('\n');
  }

  // toggleNotes() {
  //   if(this.showNotes === false) {
  //     this.task.notes = this.task.notes.split('|').join('\n');
  //     this.showNotes = true;
  //   } else {
  //     this.showNotes = false;
  //   }
  // }

  persistTask() {
    this.state='view';
    // this.showNotes = false;
    this.task.changed = true;
    this.message.startProcess('task_save',{task:this.task});
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTask(task:Task) {
    task.changed = true;
    this.message.startProcess('task_delete',{task:task});
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  completeTask(task:Task): boolean {
    task.worker_status = 'completed';
    this.message.startProcess('task_save',{task:task});
    return false;
  }

}
