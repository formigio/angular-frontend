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
  @Input() showDelete:boolean;

  minutes:{} = [
    {value:5,label:'5 Minutes'},
    {value:10,label:'10 Minutes'},
    {value:15,label:'15 Minutes'},
    {value:20,label:'20 Minutes'},
    {value:30,label:'30 Minutes'},
    {value:60,label:'1 Hour'},
    {value:120,label:'2 Hours'},
    {value:240,label:'4 Hours'},
    {value:360,label:'6 Hours'},
    {value:480,label:'8 Hours'}
  ];

  starts:Object[] = [];
  startdates:Object[] = [];
  starttimes:Object[] = [];

  showForm:boolean = false;

  showMenu:boolean = false;

  showCustom:boolean = false;

  promisedStartDate:string;
  promisedStartTime:string;

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

  ///
  /// Commitment Edit Form
  ///

  populateStartTimes() {
    this.starts = [];

    let now = new Date();
    this.starts.push({value:now.toISOString(),label:'Immediately'});
    this.promisedStartDate = now.toISOString();
    this.promisedStartTime = now.toISOString();

    let later = new Date();
    later.setMinutes(later.getMinutes() + 15);
    this.starts.push({value:later.toISOString(),label:'In 15 Mins ('+later.toLocaleTimeString()+')'});

    later = new Date();
    later.setMinutes(later.getMinutes() + 30);
    this.starts.push({value:later.toISOString(),label:'In 30 Mins ('+later.toLocaleTimeString()+')'});

    later = new Date();
    later.setHours(later.getHours() + 1);
    this.starts.push({value:later.toISOString(),label:'In an Hour ('+later.toLocaleTimeString()+')'});

    let tomorrow = new Date();
    tomorrow.setDate(later.getDate() + 1);
    tomorrow.setHours(8);
    this.starts.push({value:tomorrow.toISOString(),label:'Early Tomorrow ('+tomorrow.toLocaleString()+')'});

    tomorrow = new Date();
    tomorrow.setDate(later.getDate() + 1);
    tomorrow.setHours(13);
    this.starts.push({value:tomorrow.toISOString(),label:'Mid Tomorrow ('+tomorrow.toLocaleString()+')'});
  }

  commitmentDates() {
    this.startdates = [];
    let list = Array.from(Array(30).keys());
    let date = new Date();
    this.startdates.push({
      value:date.toISOString(),
      label:date.toLocaleDateString('us-EN',{ weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
    });
    list.forEach(() => {
      date.setDate(date.getDate() + 1);
      this.startdates.push({
        value:date.toISOString(),
        label:date.toLocaleDateString('us-EN',{ weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
      });
    });
  }

  commitmentTimes() {
    this.starttimes = [];
    let list = Array.from(Array(48).keys());
    let date = new Date();
    date.setMinutes(0);
    date.setSeconds(0);
    this.starttimes.push({value:date.toISOString(),label:date.toLocaleTimeString()});
    list.forEach(() => {
      date.setMinutes(date.getMinutes() + (30));
      this.starttimes.push({value:date.toISOString(),label:date.toLocaleTimeString()});
    });
  }

  setCustomDate(value:string) {
    this.promisedStartDate = value;
    this.updateCustom();
  }

  setCustomTime(value:string) {
    this.promisedStartTime = value;
    this.updateCustom();
  }

  updateCustom() {
    let date = new Date(this.promisedStartDate);
    let timedate = new Date(this.promisedStartTime);
    date.setHours(timedate.getHours());
    date.setMinutes(timedate.getMinutes());
    this.commitment.promised_start = date.toISOString();
  }

  setCustomStart() {
    this.showCustom = true;
  }

  setPromisedStart(date:string) {
    this.commitment.promised_start = date;
  }

  /// Commitment Edit Form


  navigateToGoal() {
    this.message.startProcess('navigate_to',{navigate_to:'/goal/' + this.commitment.goal.id});
  }

  navigateToTeam() {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.commitment.team.id});
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

  setTaskStatus(status:string) {
    this.showMenu = false;
    this.commitment.task.work_status = status;
    this.commitment.changed = true;
    this.message.startProcess('commitment_task_save',{task:this.commitment.task,commitment:this.commitment});
  }

  toggleMenu() {
    if(this.showMenu === false) {
      this.showMenu = true;
    } else {
      this.showMenu = false;
    }
  }

  editCommitment() {
    this.populateStartTimes();
    this.commitmentDates();
    this.commitmentTimes();
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  submit(): boolean {
    this.commitment.changed = true;
    this.message.startProcess('commitment_save',{commitment:this.commitment});
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
