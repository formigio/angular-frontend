import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { CommitmentService, Commitment } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'commitment-list',
  directives: [ ],
  templateUrl: 'commitment-list.component.html',
  providers: [ CommitmentService ]
})

export class CommitmentListComponent implements OnInit {

  allCommitments: Commitment[] = [];
  completedCommitments: Commitment[] = [];
  activeCommitments: Commitment[] = [];
  futureCommitments: Commitment[] = [];
  loading: boolean = false;
  showFuture: boolean = false;
  showCompleted: boolean = false;

  displayDate: string;

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService,
    protected helper: HelperService,
    protected service: CommitmentService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'CommitmentService');
  }

 /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      commitments => {
        this.allCommitments = commitments;
        this.processCommitments();
      }
    );

    this.displayDate = this.service.getStartDate().toString();
    this.refreshCommitments();
  }

  processCommitments() {
    let commitments = this.allCommitments;
    this.loading = false;
    this.completedCommitments = [];
    this.futureCommitments = [];
    this.activeCommitments = [];

    commitments.forEach((commitment:Commitment) => {
      let future = new Date();
      future.setTime(future.getTime() + (60000*15)); // Get a date in the future 15 mins
      let promised = new Date(commitment.promised_start);

      if(commitment.task.work_status === 'completed' && this.showCompleted === false) {
        this.completedCommitments.push(commitment);
      } else if(promised > future && this.showFuture === false) {
        this.futureCommitments.push(commitment);
      } else {
        this.activeCommitments.push(commitment);
      }
    });
  }

  refreshCommitments() {
    this.loading = true;
    this.message.startProcess('load_commitments',{});
  }

  incrementDate() {
    this.service.incrementDate();
    this.displayDate = this.service.getStartDate().toString();
    this.refreshCommitments();
  }

  decrementDate() {
    this.service.decrementDate();
    this.displayDate = this.service.getStartDate().toString();
    this.refreshCommitments();
  }

  today() {
    this.service.today();
    this.displayDate = this.service.getStartDate().toString();
    this.refreshCommitments();
  }

  toggleFuture() {
    if(this.showFuture) {
      this.showFuture = false;
    } else {
      this.showFuture = true;
    }
    this.processCommitments();
  }

  toggleCompleted() {
    if(this.showCompleted) {
      this.showCompleted = false;
    } else {
      this.showCompleted = true;
    }
    this.processCommitments();
  }


} // Component end
