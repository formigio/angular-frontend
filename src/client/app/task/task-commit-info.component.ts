import { Component, Input } from '@angular/core';
import { Task } from './index';
import { MessageService } from '../core/index';
import { Commitment, CommitmentStruct } from '../commitment/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-commit-info',
  templateUrl: 'task-commit-info.component.html',
  providers: [ ]
})

export class TaskCommitInfoComponent {

  @Input() task:Task;

  commitment:Commitment = CommitmentStruct;

  minutes:{} = {
    5:'5 Minutes',
    10:'10 Minutes',
    15:'15 Minutes',
    20:'20 Minutes',
    30:'30 Minutes',
    60:'1 Hour',
    120:'2 Hours',
    240:'4 Hours',
    360:'6 Hours',
    480:'8 Hours'
  };

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService
  ) {}

}
