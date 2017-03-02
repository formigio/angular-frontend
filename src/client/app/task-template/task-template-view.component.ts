import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskTemplateService, TaskTemplate, TaskTemplateStruct } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded TaskViewComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-template-view',
  templateUrl: 'task-template-view.component.html',
  providers: [ TaskTemplateService ]
})
export class TaskTemplateViewComponent implements OnInit {

  @Input() editable:boolean;

  errorMessage: string;
  currentResponse: {};
  taskTemplate: TaskTemplate = TaskTemplateStruct;
  fullDocumentation: string = '';
  showForm: boolean = false;

  /**
   * Creates an instance of the TaskViewComponent with the injected
   * TaskService, Router, and Active Route.
   *
   * @param {TaskTemplateService} taskService - The injected TaskService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected service: TaskTemplateService,
    protected route: ActivatedRoute,
    protected message: MessageService,
    protected helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskTemplateService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      taskTemplate => {
        console.log('Item Subscription');
        console.log(taskTemplate);
        this.taskTemplate = <TaskTemplate>taskTemplate;
        this.setDocs();
      }
    );
    this.route.params.subscribe(params => {
      this.message.startProcess('task_template_view',params);
    });
  }

  setDocs() {
    if(this.taskTemplate.documentation === null || this.taskTemplate.documentation === '') {
      this.fullDocumentation = '';
    } else {
      let parts = this.taskTemplate.documentation.split('\n');
      this.fullDocumentation = parts.join('<br>');
    }
  }

  edit() {
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  /**
   * Deletes a new task onto the tasks array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTaskTemplate(taskTemplate:TaskTemplate): boolean {
    this.message.startProcess('task_template_delete',{id:taskTemplate.id});
    return false;
  }

  persistTaskTemplate() {
    this.showForm = false;
    this.taskTemplate.changed = true;
    this.message.startProcess('task_template_save',{taskTemplate:this.taskTemplate});
  }

}
