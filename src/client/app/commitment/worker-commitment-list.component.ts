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
  pastCommitments: Commitment[] = [];
  loading: boolean = false;
  showFuture: boolean = false;
  showPast: boolean = false;
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
    this.pastCommitments = [];
    this.activeCommitments = [];
    this.dailyCommittedMinutes = 0;

    commitments.forEach((commitment:Commitment) => {
      let now = new Date();
      let today = this.service.getToday();
      let future = new Date();
      future.setTime(future.getTime() + (60000*15)); // Get a date in the future 15 mins
      let promised = new Date(commitment.promised_start);

      if(commitment.task.work_status !== 'completed') {
        this.dailyCommittedMinutes += Number(commitment.promised_minutes);
      }

      if(commitment.task.work_status === 'completed' && this.showCompleted === false) {
        this.completedCommitments.push(commitment);
      } else if(promised > future && this.showFuture === false && this.service.getStartDate() < now) {
        this.futureCommitments.push(commitment);
      } else if(promised < today && this.showPast === false) {
        this.pastCommitments.push(commitment);
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
    if(mins>0) timestring += mins + ' mins ';
    if(mins===0 && hours===0) {
      timestring = 'no';
    } else {
      timestring += 'of';
    }
    return timestring;
  }

  getStartDate():string {
    return this.service.getStartDate().toLocaleDateString('en-US',{ month: 'short'})
      + ' ' + this.service.getStartDate().toLocaleDateString('en-US',{ day: 'numeric'});
  }

  isStartDateFuture():boolean {
    let now = new Date();
    return this.service.getStartDate() > now;
  }

  canShowPast():boolean {
    return this.service.showPast();
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
    this.service.loadToday();
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

  togglePast() {
    if(this.showPast) {
      this.showPast = false;
    } else {
      this.showPast = true;
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
