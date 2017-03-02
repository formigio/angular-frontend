import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { TaskTemplateService, TaskTemplate, TaskTemplateItemComponent, TaskTemplateStruct } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-template-list',
  directives: [ TaskTemplateItemComponent ],
  templateUrl: 'task-template-list.component.html',
  providers: [ TaskTemplateService ]
})

export class TaskTemplateListComponent implements OnInit {

  taskTemplates: TaskTemplate[] = [];
  taskTemplate: TaskTemplate = TaskTemplateStruct;
  goal: string = '';
  loading: boolean = true;
  maxSequence: number = 0;

  constructor(
    public service: TaskTemplateService,
    public helper: HelperService,
    public message: MessageService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskTemplateService');
  }

  ngOnInit() {
    this.service.getListSubscription().subscribe(
      tasks => {
        this.loading = false;
        this.taskTemplates = <TaskTemplate[]>tasks;
        this.processTaskTemplates();
      }
    );
    this.route.params.subscribe(params => {
      this.goal = params['id'];
      this.refreshTaskTemplates();
    });
  }

  processTaskTemplates() {
    let newtaskTemplates:TaskTemplate[] = [];
    let alltaskTemplates:TaskTemplate[] = this.taskTemplates;
    this.maxSequence = 0;
    alltaskTemplates.forEach((taskTemplate) => {
      if(taskTemplate.title) {
        newtaskTemplates.push(taskTemplate);
      }
      this.maxSequence = Math.max(Number(taskTemplate.sequence), this.maxSequence);
    });
    this.taskTemplates = newtaskTemplates;
  }

  refreshTaskTemplates() {
    this.loading = true;
    this.message.startProcess('task_template_load_list',{goal:this.goal});
  }

  addTaskTemplate(): boolean {
    this.taskTemplate.id = '';
    this.taskTemplate.changed = true;
    this.taskTemplate.goal_template_id = this.goal;
    let taskLines = this.taskTemplate.title.split('\n');
    taskLines.forEach((taskTitle) => {
      if(taskTitle) {
        let newTaskTemplate: TaskTemplate = JSON.parse(JSON.stringify(this.taskTemplate));
        let sequenced = taskTitle.match(/^([0-9]+)\./);
        if(sequenced) {
          newTaskTemplate.sequence = sequenced.pop();
          newTaskTemplate.title = taskTitle.replace(/^[0-9]+\./,'').trim();
        } else {
          this.maxSequence++;
          newTaskTemplate.title = taskTitle;
          newTaskTemplate.sequence = String(this.maxSequence);
        }
        this.taskTemplates.push(newTaskTemplate);
      }
    });
    this.helper.sortBy(this.taskTemplates,'sequence');
    this.taskTemplate.title = '';
    this.taskTemplate.documentation = '';
    return false;
  }

  watchInput(e:any):any {
    if(e.keyCode === 13 && !e.shiftKey) {
      this.addTaskTemplate();
      return false;
    }
  }

  navigateToTeam(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/goal/' + this.goal});
    return false;
  }

  navigateToTeams(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/teams/'});
    return false;
  }

}
