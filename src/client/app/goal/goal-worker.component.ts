import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
import { GoalService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-worker',
  template: `<div></div>`,
  providers: [ GoalService ]
})
export class GoalWorkerComponent implements OnInit, WorkerComponent {

  public routines: {} = {
      goal_delete: new ProcessRoutine(
          'goal_delete',
          'The Process Used to Control the Deletion of Goals',
          new ProcessContext,
          (context:ProcessContext) => { return (<any>context.params).goal_deleted; },
          ''
      ),
      goal_view: new ProcessRoutine(
          'goal_view',
          'The Process Used to Control the Viewing of Goals',
          new ProcessContext,
          (context:ProcessContext) => { return (<any>context.params).goal_loaded; },
          ''
      )
  };

  public tasks: {} = {
      remove_invites_complete: new ProcessTask(
          'remove_goal',
          'remove_invites_complete',
          'Delete Goal',
          'removeGoal',
          {goal:'string', invite_count:'string', task_count:'string'}
      ),
      goal_view_init: new ProcessTask(
          'load_goal',
          'goal_view_init',
          'Load Goal',
          'loadGoal',
          {goal_uuid:'string'}
      )
  };

  constructor(
    public service: GoalService,
    public message: MessageService,
    public helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalService');
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

  protected removeGoal(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: number = params.task_count;
    let obs = new Observable((observer:any) => {
      if(taskCount > 0) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'You can only delete a goal, when it is empty. taskCount:' + taskCount,
          context:{params:{}}
        });
      } else {
        this.service.delete(goal).subscribe(
          null,
          error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured during Goal delete',
            context:{params:{}}
          }),
          () => {
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Goal removed successfully.',
              context:{params:{goal_deleted:true, navigate_to:'/teams'}}
            });
            observer.complete();
          }
        );
      }
    });
    return obs;
  }

  public loadGoal(control_uuid: string, params: any): Observable<any> {
    let uuid: string = params.goal_uuid;
    let obs = new Observable((observer:any) => {
      this.service.publishGoal(uuid);
      observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal loaded successfully.',
            context:{params:{goal_loaded:uuid}}
      });
      observer.complete();
    });
    return obs;
  }
}
