import { Component, Input, OnInit } from '@angular/core';
import { CommitmentService, Commitment } from './index';
import { MessageService } from '../core/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'worker-commitment-item',
  templateUrl: 'worker-commitment-item.component.html',
  providers: [ ]
})

export class WorkerCommitmentItemComponent implements OnInit {

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
    //
  }

  getCommittedTime(): string {
    let promised_mins = Number(this.commitment.promised_minutes);
    let hours = Math.floor(promised_mins/60);
    let mins = promised_mins-(hours*60);
    let timestring = '';
    if(hours>0) timestring += hours + ' hrs ';
    if(mins>0) timestring += mins + ' mins';
    return timestring;
  }

  navigateToGoal() {
    this.message.startProcess('navigate_to',{navigate_to:'/goal/' + this.commitment.goal.id});
  }

  navigateToTeam() {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.commitment.team.id});
  }

}
