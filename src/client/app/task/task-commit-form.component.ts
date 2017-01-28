import { Component, Input, OnInit } from '@angular/core';
import { Task } from './index';
import { MessageService } from '../core/index';
import { Commitment } from '../commitment/index';


/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-commit-form',
  templateUrl: 'task-commit-form.component.html',
  providers: [ ]
})

export class TaskCommitFormComponent implements OnInit {

  @Input() task:Task;

  commitment:Commitment = {
    id: '',
    task_id: '',
    worker_id: '',
    promised_start: '',
    promised_minutes: '',
    changed: false,
    task: {
      id:'',
      goal_id:'',
      title:'',
      sequence: '',
      work_status:'',
      system_status:'',
      changed: false
    }
  };

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

  starttimes:Object[] = [];

  showForm:boolean = false;

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.populateStartTimes();
  }

  populateStartTimes() {
    let now = new Date();
    this.starttimes.push({value:now.toISOString(),label:'Immediately'});
    let later = new Date();
    later.setHours(later.getHours() + 1);
    this.starttimes.push({value:later.toISOString(),label:'Later ('+later+')'});
    let tomorrow = new Date();
    tomorrow.setDate(later.getDate() + 1);
    this.starttimes.push({value:tomorrow.toISOString(),label:'Tomorrow ('+tomorrow+')'});
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  submit(): boolean {
    this.task.changed = true;
    this.message.startProcess('commitment_create',{task:this.task,commitment:this.commitment});
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  openForm() {
    this.showForm = true;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  closeForm() {
    this.showForm = false;
  }

}
