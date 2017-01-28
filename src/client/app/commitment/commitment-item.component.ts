import { Component, Input, OnInit } from '@angular/core';
import { CommitmentService, Commitment } from './index';
import { MessageService } from '../core/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'commitment-item',
  templateUrl: 'commitment-item.component.html',
  providers: [ ]
})

export class CommitmentItemComponent implements OnInit {

  @Input() commitment:Commitment;

  /**
   *
   * @param
   */
  constructor(
    protected service: CommitmentService,
    protected message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    // if(!this.commitment.id) {
    //   this.message.startProcess('commitment_create',{task:this.task});
    // }
  }

  navigateToGoal() {
    this.message.startProcess('navigate_to',{navigate_to:'/goal/' + this.commitment.task.goal_id});
  }

  // persistTask() {
  //   this.state='view';
  //   // this.showNotes = false;
  //   this.task.changed = true;
  //   this.message.startProcess('task_save',{task:this.task});
  // }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteCommitment() {
    this.commitment.changed = true;
    this.message.startProcess('commitment_delete',{commitment:this.commitment});
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // completeTask(task:Task): boolean {
  //   task.work_status = 'completed';
  //   this.message.startProcess('task_save',{task:task});
  //   return false;
  // }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // claimTask(task:Task): boolean {
  //   task.work_status = 'scheduled';
  //   this.message.startProcess('task_commit',{task:task});
  //   return false;
  // }

}
