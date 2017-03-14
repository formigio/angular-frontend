import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
import { TaskTemplate } from '../task-template/index';
import { Goal } from '../goal/index';
import { Task, TaskService, TaskStruct } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-worker',
  template: `<div></div>`,
  providers: [ TaskService ]
})
export class TaskWorkerComponent implements OnInit, WorkerComponent {

    public routines: {} = {
        task_delete: new ProcessRoutine(
            'task_delete',
            'The Process Used to Control the Deletion of Tasks',
            new ProcessContext,
            ''
        ),
        load_task_list: new ProcessRoutine(
            'load_task_list',
            'The Process Used to Control the Loading of Tasks',
            new ProcessContext,
            ''
        ),
        task_create: new ProcessRoutine(
            'task_create',
            'The Process Used to Control the Creating a Task',
            new ProcessContext,
            ''
        ),
        task_save: new ProcessRoutine(
            'task_save',
            'The Process Used to Control the Save a Task',
            new ProcessContext,
            ''
        )
    };

    public tasks: {} = {
        get_user_for_delete_task_complete: new ProcessTask(
            'delete_task',
            'get_user_for_delete_task_complete',
            'Delete Task',
            'deleteTask',
            {user:'User',task:'Task'}
        ),
        // goal_delete_init: new ProcessTask(
        //     'gather_goal_tasks',
        //     'goal_delete_init',
        //     'Gather Goal Tasks',
        //     'gatherTasks',
        //     {goal:'string'}
        // ),
        // gather_goal_tasks_complete: new ProcessTask(
        //     'remove_tasks',
        //     'gather_goal_tasks_complete',
        //     'Remove Tasks for a specific goal',
        //     'removeTasks',
        //     {goal:'string', task_count:'string'}
        // ),
        get_user_for_load_task_list_complete: new ProcessTask(
            'load_tasks',
            'get_user_for_load_task_list_complete',
            'Fetch Tasks for a specific goal',
            'gatherTasks',
            {goal:'string',user:'User'}
        ),
        get_user_for_save_goal_template_complete: new ProcessTask(
            'gather_tasks_for_goal_template',
            'get_user_for_save_goal_template_complete',
            'Fetch Tasks for a specific goal',
            'gatherTasks',
            {goal:'string',user:'User'}
        ),
        load_tasks_complete: new ProcessTask(
            'publish_tasks',
            'load_tasks_complete',
            'Publish Tasks for a specific goal',
            'publishTasks',
            {tasks:'array'}
        ),
        get_user_for_task_create_complete: new ProcessTask(
            'create_task',
            'get_user_for_task_create_complete',
            'Create Task for a specific goal',
            'createTask',
            {task:'Task',user:'User'}
        ),
        get_user_for_task_save_complete: new ProcessTask(
            'save_task',
            'get_user_for_task_save_complete',
            'Save Task for a specific goal',
            'saveTask',
            {task:'Task',user:'User'}
        ),
        get_user_for_commitment_task_save_complete: new ProcessTask(
            'save_task_from_commitment',
            'get_user_for_commitment_task_save_complete',
            'Save Task for a specific goal',
            'saveTask',
            {task:'Task',user:'User'}
        ),
        create_commitment_complete: new ProcessTask(
            'publish_task',
            'create_commitment_complete',
            'Publish Task from the Process Context',
            'publishTask',
            {task:'Task'}
        ),
        load_team_task_templates_for_create_goal_from_template_complete: new ProcessTask(
            'create_tasks_from_templates',
            'load_team_task_templates_for_create_goal_from_template_complete',
            'Publish Task from the Process Context',
            'createTasksFromTemplates',
            {goal:'Goal','taskTemplates':'TaskTemplate'}
        )
    };

  constructor(
    protected service: TaskService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
      // Subscribe to Process Queue
      // Process Tasks based on messages received
      if(Object.keys(this.tasks).length > 0) {
        this.message.getWorkerQueue().subscribe(
          message => {
            // Process Signals
            message.processSignal(this);
          }
        );
      }
      if(Object.keys(this.routines).length > 0) {
        this.message.getProcessQueue().subscribe(
          message => {
            // Process Inits
            message.initProcess(this);
          }
        );
      }
  }

  public createTask(control_uuid: string, params: any): Observable<any> {
    let task: Task = params.task;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(task).then(
        response => {
          let task = <Task>response.data;
          this.service.addTask(task);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Created.',
            context:{params:{task:task}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the tasks.'
          });
        }
      );
    });

    return obs;
  }

  public createTasksFromTemplates(control_uuid: string, params: any): Observable<any> {
    let taskTemplates: TaskTemplate[] = params.taskTemplates;
    let goal: Goal = params.goal;
    let user: User = params.user;
    let newTasks: Task[] = [];
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      taskTemplates.forEach((taskTemplate) => {
        let task = JSON.parse(JSON.stringify(TaskStruct));
        task.title = taskTemplate.title;
        task.goal_id = goal.id;
        task.sequence = taskTemplate.sequence;
        task.template_id = taskTemplate.id;
        this.service.post(task).then(
          response => {
            let task = <Task>response.data;
            this.service.addTask(task);
            newTasks.push(task);
          }
        ).catch(
          error => {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'An error has occured fetching the tasks.'
            });
          }
        );
        if(taskTemplates.length == newTasks.length) {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Tasks Created.',
            context:{params:{}}
          });
          observer.complete();
        }
      });
    });

    return obs;
  }


  public saveTask(control_uuid: string, params: any): Observable<any> {
    let task: Task = params.task;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(task).then(
        response => {
          let task = <Task>response.data;
          this.service.publishTask(task);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Saved.',
            context:{params:{task:task}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the tasks.'
          });
        }
      );
    });

    return obs;
  }

  public publishTask(control_uuid: string, params: any): Observable<any> {
    let task: Task = params.task;
    let obs = new Observable((observer:any) => {
      this.service.publishTask(task);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Task Updated.',
        context:{params:{task:task}}
      });
      observer.complete();
    });

    return obs;
  }

  public gatherTasks(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(goal).then(
        response => {
          let tasks = <Task[]>response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:tasks.length + ' Tasks fetched.',
            context:{params:{tasks:tasks,task_count:tasks.length}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the tasks.'
          });
        }
      );
    });

    return obs;
  }

  public publishTasks(control_uuid: string, params: any): Observable<any> {
    let tasks: Task[] = params.tasks;
    let obs = new Observable((observer:any) => {
      this.service.publishTasks(tasks);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message: ' Tasks Published.',
        context:{params:{}}
      });
      observer.complete();
    });

    return obs;
  }

  public deleteTask(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let task: Task = params.task;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(task.id).then(
        response => {
          this.service.removeTask(task.id);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task Removed.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured removing the task.'
          });
        }
      );
    });
    return obs;
  }

  // public removeTasks(control_uuid: string, params: any): Observable<any> {
  //   let tasks: Task[] = params.tasks;
  //   let tasksRemoved: string[] = [];
  //   let obs = new Observable((observer:any) => {
  //     if(tasks.length === 0) {
  //       observer.next({
  //         control_uuid: control_uuid,
  //         outcome: 'success',
  //         message:'No Tasks to Remove.',
  //         context:{params:{task_count:0}}
  //       });
  //       observer.complete();
  //     }
  //     tasks.forEach((task) => {
  //       this.service.delete(task).subscribe(
  //         null,
  //         error => observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'Error has occured while removing tasks.',
  //           context:{params:{}}
  //         }),
  //         () => {
  //           tasksRemoved.push(task.uuid);
  //           if(tasks.length === tasksRemoved.length) {
  //             observer.next({
  //               control_uuid: control_uuid,
  //               outcome: 'success',
  //               message:'Tasks removed successfully.',
  //               context:{params:{task_count:0}}
  //             });
  //             observer.complete();
  //           }
  //         }
  //       );
  //     });
  //   });
  //   return obs;
  // }

}
