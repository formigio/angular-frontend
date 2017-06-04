import { Component, Input, OnInit } from '@angular/core';
import { TaskService, Task, TaskStruct } from './index';
import { MessageService, HelperService } from '../core/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-view',
  templateUrl: 'task-view.component.html',
  providers: [ TaskService ]
})

export class TaskViewComponent implements OnInit {

  @Input() id:string;

  task: Task = TaskStruct;
  state: string = 'view';
  response: any;
  showNotes: boolean = false;
  showMenu: boolean = false;
  showCommitForm: boolean = false;

  /**
   *
   * @param
   */
  constructor(
    protected service: TaskService,
    protected message: MessageService,
    protected helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      task => this.task = <Task>task
    );
    if(!this.task.id) {
      this.message.startProcess('task_fetch',{id:this.id});
    }
  }

  makeEditable() {
    this.state = 'edit';
  }

  toggleMenu() {
    if(this.showMenu === false) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }

  closeForm() {
    this.state = 'view';
  }

  setStatus(status:string) {
    this.showMenu = false;
    this.closeForm();
    this.task.work_status = status;
    this.persistTask();
  }

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

}
