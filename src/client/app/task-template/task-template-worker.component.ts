import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessContext,
  ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
import { User } from '../user/index';
import { TaskTemplate, TaskTemplateService } from './index';

/**
 * This class represents the lazy loaded TaskWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-template-worker',
  template: `<div></div>`,
  providers: [ TaskTemplateService ]
})
export class TaskTemplateWorkerComponent implements OnInit, WorkerComponent {

  public workQueue: ReplaySubject<any> = new ReplaySubject(1);

  public routines: {} = {
      task_template_delete: new ProcessRoutine(
          'task_template_delete',
          'The Process Used to Control the Deletion of Tasks'
      ),
      task_template_view: new ProcessRoutine(
          'task_template_view',
          'The Process Used to Control the Viewing of Tasks'
      ),
      task_template_load_list: new ProcessRoutine(
          'task_template_load_list',
          'The Process Used to Control the Viewing of Tasks'
      ),
      task_template_create: new ProcessRoutine(
          'task_template_create',
          'The Process Used to Control the Creating of Tasks'
      ),
      task_template_save: new ProcessRoutine(
          'task_template_save',
          'The Process Used to Control the Saving of Tasks'
      )
  };

  public tasks: {} = {
      get_user_for_task_template_view_complete: new ProcessTask(
          'load_task_template',
          'get_user_for_task_template_view',
          'task_template_view',
          'Load Task Template',
          'loadTaskTemplate',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_task_template_view_complete');
            },
          {id:'string',user:'User'}
      ),
      create_goal_from_template_complete: new ProcessTask(
          'load_team_task_templates_for_create_goal_from_template',
          'create_goal_from_template_complete',
          'goal_template_to_goal',
          'Load Task Templates',
          'loadTaskTemplates',
            (context:ProcessContext) => {
              return context.hasSignal('create_goal_from_template_complete');
            },
          {goalTemplate:'string',user:'User'}
      ),
      get_user_for_task_template_load_list_complete: new ProcessTask(
          'load_team_task_templates',
          'get_user_for_task_template_load_list_complete',
          'task_template_load_list',
          'Load Task Templates',
          'loadTaskTemplates',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_task_template_load_list_complete');
            },
          {goalTemplate:'string',user:'User'}
      ),
      get_user_for_task_template_create_complete: new ProcessTask(
          'create_task_template',
          'get_user_for_task_template_create_complete',
          'task_template_create',
          'Create Task Tempalte',
          'createTaskTemplate',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_task_template_create_complete');
            },
          {taskTemplate:'TaskTemplate',user:'User'}
      ),
      get_user_for_task_template_save_complete: new ProcessTask(
          'save_task_template',
          'get_user_for_task_template_save_complete',
          'task_template_save',
          'Save Task Template',
          'saveTaskTemplate',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_task_template_save_complete');
            },
          {taskTemplate:'TaskTemplate',user:'User'}
      ),
      get_user_for_task_template_delete_complete: new ProcessTask(
          'delete_task_template',
          'get_user_for_task_template_delete_complete',
          'task_template_delete',
          'Delete Task Template',
          'deleteTaskTemplate',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_task_template_delete_complete');
            },
          {id:'string',user:'User'}
      )
  };

  constructor(
    public service: TaskTemplateService,
    public message: MessageService,
    public helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskTemplateService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.message.getRegistrarQueue().subscribe(
      taskRegistration => {
        if(Object.keys(taskRegistration.tasks).length) {
          Object.values(taskRegistration.tasks).forEach((task:ProcessTask) => {
            task.queue = taskRegistration.queue;
            if(this.routines.hasOwnProperty(task.routine)) {
              let processRoutine = (<any>this.routines)[task.routine];
              processRoutine.tasks.push(task);
            }
          });
        }
      }
    );
    this.message.registerProcessTasks(new ProcessTaskRegistration(this.tasks,this.workQueue));

    // Subscribe to Process Queue
    // Process Tasks based on messages received
    if(Object.keys(this.tasks).length > 0) {
      this.workQueue.subscribe(
        workMessage => {
          // Process Signals
          workMessage.executeMethod(this);
        }
      );
    }
    if(Object.keys(this.routines).length > 0) {
      this.message.getProcessInitQueue().subscribe(
        message => {
          // Process Inits
          message.initProcess(this);
        }
      );
    }
  }

  public loadTaskTemplate(control_uuid: string, params: any): Observable<any> {
    let id: string = params.id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.get(id).then(
        response => {
          this.service.publishTaskTemplate(response.data);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Template Loaded.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Task Template Load Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public loadTaskTemplates(control_uuid: string, params: any): Observable<any> {
    let goalTemplate: string = params.goalTemplate;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(goalTemplate).then(
        response => {
          let taskTemplates = <TaskTemplate[]>response.data;
          this.service.publishTaskTemplates(taskTemplates);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message: 'Task Template loaded successfully.',
            context:{params:{taskTemplates:taskTemplates}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message: 'Tasks Template Load Failed.',
          context:{params:{}}
        })
      );
    });
    return obs;
  }

  public createTaskTemplate(control_uuid: string, params: any): Observable<any> {
    let taskTemplate: TaskTemplate = params.taskTemplate;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(taskTemplate).then(
        response => {
          taskTemplate = <TaskTemplate>response.data;
          this.service.addTaskTemplate(taskTemplate);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Template Saved Successfully.',
            context:{params:{task:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Task Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public deleteTaskTemplate(control_uuid: string, params: any): Observable<any> {
    let id: string = params.id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(id).then(
        response => {
          this.service.removeTaskTemplate(id);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Template Remove Successfully.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Task Template Remove Failed. You can only delete empty Task Templates.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public saveTaskTemplate(control_uuid: string, params: any): Observable<any> {
    let taskTemplate: TaskTemplate = params.taskTemplate;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(taskTemplate).then(
        response => {
          taskTemplate = <TaskTemplate>response.data;
          this.service.updateTaskTemplate(taskTemplate);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Template Saved Successfully.',
            context:{params:{taskTemplate:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Task Template Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

}
