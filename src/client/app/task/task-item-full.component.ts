import { Component, Input, OnInit } from '@angular/core';
import { TaskService, Task } from './index';
import { MessageService } from '../core/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-item-full',
  templateUrl: 'task-item-full.component.html',
  providers: [ ]
})

export class TaskItemFullComponent implements OnInit {

  @Input() task:Task;
  @Input() editable: boolean;
  @Input() editing: boolean;

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

  // toggleNotes() {
  //   if(this.showNotes === false) {
  //     this.task.notes = this.task.notes.split('|').join('\n');
  //     this.showNotes = true;
  //   } else {
  //     this.showNotes = false;
  //   }
  // }

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

  navigateToGoal() {
    this.message.startProcess('navigate_to',{navigate_to:'/goal/' + this.task.goal.id});
  }

  navigateToTeam() {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.task.team.id});
  }

  navigateToTask() {
    this.message.startProcess('navigate_to',{navigate_to:'/task/' + this.task.id});
  }

}
