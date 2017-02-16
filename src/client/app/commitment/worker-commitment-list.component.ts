import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { CommitmentService, Commitment } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'worker-commitment-list',
  directives: [ ],
  templateUrl: 'worker-commitment-list.component.html',
  providers: [ CommitmentService ]
})

export class WorkerCommitmentListComponent implements OnInit {

  workerId: string = '';
  workerName: string = '';
  allCommitments: Commitment[] = [];
  completedCommitments: Commitment[] = [];
  activeCommitments: Commitment[] = [];
  futureCommitments: Commitment[] = [];
  loading: boolean = false;
  showFuture: boolean = false;
  showCompleted: boolean = false;
  dailyCommittedMinutes: number = 0;
  showDelete: boolean;

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService,
    protected route: ActivatedRoute,
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
        this.allCommitments = commitments.commitments;
        this.workerName = commitments.worker.name;
        this.processCommitments();
      }
    );
    this.route.params.subscribe(params => {
      this.workerId = (<any>params).workerId;
      this.refreshCommitments();
    });
  }

  processCommitments() {
    let commitments = this.allCommitments;
    this.loading = false;
    this.completedCommitments = [];
    this.futureCommitments = [];
    this.activeCommitments = [];
    this.dailyCommittedMinutes = 0;

    commitments.forEach((commitment:Commitment) => {
      let now = new Date();
      let future = new Date();
      future.setTime(future.getTime() + (60000*15)); // Get a date in the future 15 mins
      let promised = new Date(commitment.promised_start);

      if(commitment.task.work_status !== 'completed') {
        this.dailyCommittedMinutes += Number(commitment.promised_minutes);
      }

      // Check if the Commitment Date is the same as the start date, if not remove from the list
      if(this.service.getStartDate().toLocaleDateString() !== promised.toLocaleDateString()) {
        return;
      } else if(commitment.task.work_status === 'completed' && this.showCompleted === false) {
        this.completedCommitments.push(commitment);
      } else if(promised > future && this.showFuture === false && this.service.getStartDate() < now) {
        this.futureCommitments.push(commitment);
      } else {
        this.activeCommitments.push(commitment);
      }
    });
  }

  getCommittedTime() {
    let hours = Math.floor(this.dailyCommittedMinutes/60);
    let mins = this.dailyCommittedMinutes-(hours*60);
    let timestring = '';
    if(hours>0) timestring += hours + ' hrs ';
    if(mins>0) timestring += mins + ' mins';
    return timestring;
  }

  getStartDate():string {
    return this.service.getStartDate().toLocaleDateString('en-US',{ weekday: 'short', month: 'short', day: 'numeric' });
  }

  isStartDateFuture():boolean {
    let now = new Date();
    return this.service.getStartDate() > now;
  }

  refreshCommitments() {
    this.loading = true;
    this.message.startProcess('commitment_load_worker_commitments',{workerId:this.workerId});
  }

  incrementDate() {
    this.service.incrementDate();
    this.refreshCommitments();
  }

  decrementDate() {
    this.service.decrementDate();
    this.refreshCommitments();
  }

  today() {
    this.service.today();
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
