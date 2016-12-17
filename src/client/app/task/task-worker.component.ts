import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
import { Task, TaskService } from './index';

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
        )
    };

    public tasks: {} = {
        task_delete_init: new ProcessTask(
            'delete_task',
            'goal_delete_init',
            'Delete Task',
            'deleteTask',
            {task:'Task'}
        ),
        goal_delete_init: new ProcessTask(
            'gather_goal_tasks',
            'goal_delete_init',
            'Gather Goal Tasks',
            'gatherTasks',
            {goal:'string'}
        ),
        gather_goal_tasks_complete: new ProcessTask(
            'remove_tasks',
            'gather_goal_tasks_complete',
            'Remove Tasks for a specific goal',
            'removeTasks',
            {goal:'string', task_count:'string'}
        ),
        get_user_for_load_task_list_complete: new ProcessTask(
            'load_tasks',
            'get_user_for_load_task_list_complete',
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
      )
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
    let task: Task = params.task;
    let obs = new Observable((observer:any) => {
      this.service.delete(task).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while removing tasks.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Task removed successfully.',
            context:{params:{task_deleted:task.uuid}}
          });
          this.service.refreshTasks(task.goal);
          observer.complete();
        }
      );
    });
    return obs;
  }

  public removeTasks(control_uuid: string, params: any): Observable<any> {
    let tasks: Task[] = params.tasks;
    let tasksRemoved: string[] = [];
    let obs = new Observable((observer:any) => {
      if(tasks.length === 0) {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'No Tasks to Remove.',
          context:{params:{task_count:0}}
        });
        observer.complete();
      }
      tasks.forEach((task) => {
        this.service.delete(task).subscribe(
          null,
          error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Error has occured while removing tasks.',
            context:{params:{}}
          }),
          () => {
            tasksRemoved.push(task.uuid);
            if(tasks.length === tasksRemoved.length) {
              observer.next({
                control_uuid: control_uuid,
                outcome: 'success',
                message:'Tasks removed successfully.',
                context:{params:{task_count:0}}
              });
              observer.complete();
            }
          }
        );
      });
    });
    return obs;
  }

}
