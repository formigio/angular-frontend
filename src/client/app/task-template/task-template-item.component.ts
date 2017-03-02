import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { TaskTemplateService, TaskTemplate } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-template-item',
  templateUrl: 'task-template-item.component.html',
  providers: [ TaskTemplateService ]
})

export class TaskTemplateItemComponent implements OnInit {

  @Input() taskTemplate:TaskTemplate;

  state: string = 'view';
  showFullDocumentation: boolean = false;
  fullDocumentation: string = '';

  /**
   *
   * @param
   */
  constructor(
    public message: MessageService,
    public service: TaskTemplateService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    if(!this.taskTemplate.id) {
      this.message.startProcess('task_template_create',{
        taskTemplate:this.taskTemplate,navigate_to:'/task_template/' + this.taskTemplate.id});
    }
    this.setDocs();
  }

  edit() {
    this.state = 'edit';
  }

  cancel() {
    this.state = 'view';
  }

  persistTaskTemplate() {
    this.state='view';
    this.taskTemplate.changed = true;
    this.message.startProcess('task_template_save',{taskTemplate:this.taskTemplate});
  }

  toggleFullDocumentation() {
    if(this.showFullDocumentation === false) {
      this.showFullDocumentation = true;
    } else {
      this.showFullDocumentation = false;
    }
    this.setDocs();
  }

  setDocs() {
    if(this.taskTemplate.documentation === null || this.taskTemplate.documentation === '') {
      this.fullDocumentation = '';
    } else {
      let parts = this.taskTemplate.documentation.split('\n');
      if(this.showFullDocumentation) {
        this.fullDocumentation = parts.join('<br>');
      } else {
        this.fullDocumentation = parts.shift();
      }
    }
  }

  /**
   * Deletes a new task onto the tasks array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTaskTemplate(): boolean {
    this.taskTemplate.changed = true;
    this.message.startProcess('task_template_delete',{id:this.taskTemplate.id});
    return false;
  }

  navigateTo(taskTemplate:TaskTemplate) {
    this.message.startProcess('navigate_to',{navigate_to:'/task-template/' + taskTemplate.id});
  }

  sequenceUp() {
    this.taskTemplate.sequence = String(Number(this.taskTemplate.sequence)+1);
    this.persistTaskTemplate();
  }

  sequenceDown() {
    this.taskTemplate.sequence = String(Number(this.taskTemplate.sequence)-1);
    this.persistTaskTemplate();
  }

}
