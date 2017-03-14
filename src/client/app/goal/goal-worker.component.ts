import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
import { GoalTemplate } from '../goal-template/index';
import { Goal, GoalService, GoalStruct } from './index';

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
          ''
      ),
      goal_view: new ProcessRoutine(
          'goal_view',
          'The Process Used to Control the Viewing of Goals',
          new ProcessContext,
          ''
      ),
      load_goal_list: new ProcessRoutine(
          'load_goal_list',
          'The Process Used to Control the Viewing of Goals',
          new ProcessContext,
          ''
      ),
      create_goal: new ProcessRoutine(
          'create_goal',
          'The Process Used to Control the Creating of Goals',
          new ProcessContext,
          ''
      ),
      goal_save: new ProcessRoutine(
          'goal_save',
          'The Process Used to Control the Saving of Goals',
          new ProcessContext,
          ''
      ),
      goal_save_template_from_goal: new ProcessRoutine(
          'goal_save_template_from_goal',
          'The Process Used to Control the Saving of Goal Templates',
          new ProcessContext,
          ''
      )
  };

  public tasks: {} = {
      get_user_for_goal_template_to_goal_complete: new ProcessTask(
          'create_goal_from_template',
          'get_user_for_goal_template_to_goal_complete',
          'Create Goal from Template',
          'createGoalFromTemplate',
          {goalTemplate:'GoalTemplate',user:'User'}
      ),
      remove_invites_complete: new ProcessTask(
          'remove_goal',
          'remove_invites_complete',
          'Delete Goal',
          'removeGoal',
          {goal:'string', invite_count:'string', task_count:'string'}
      ),
      get_user_for_view_goal_complete: new ProcessTask(
          'load_goal',
          'get_user_for_view_goal_complete',
          'Load Goal',
          'loadGoal',
          {goal_uuid:'string',user:'User'}
      ),
      get_user_for_load_goals_complete: new ProcessTask(
          'load_team_goals',
          'get_user_for_load_goals_complete',
          'Load Goals',
          'loadGoals',
          {team:'string',user:'User'}
      ),
      get_user_for_create_goal_complete: new ProcessTask(
          'create_goal_task',
          'get_user_for_create_goal_complete',
          'Create Goal',
          'createGoal',
          {goal:'Goal',user:'User'}
      ),
      get_user_for_goal_save_complete: new ProcessTask(
          'put_goal_task',
          'get_user_for_goal_save_complete',
          'Save Goal',
          'saveGoal',
          {goal:'Goal',user:'User'}
      ),
      get_user_for_goal_delete_complete: new ProcessTask(
          'delete_goal_task',
          'get_user_for_goal_delete_complete',
          'Delete Goal',
          'deleteGoal',
          {goal:'Goal',user:'User'}
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

  // protected removeGoal(control_uuid: string, params: any): Observable<any> {
  //   let goal: string = params.goal;
  //   let taskCount: number = params.task_count;
  //   let obs = new Observable((observer:any) => {
  //     if(taskCount > 0) {
  //       observer.error({
  //         control_uuid: control_uuid,
  //         outcome: 'error',
  //         message:'You can only delete a goal, when it is empty. taskCount:' + taskCount,
  //         context:{params:{}}
  //       });
  //     } else {
  //       this.service.delete(goal).subscribe(
  //         null,
  //         error => observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'An error has occured during Goal delete',
  //           context:{params:{}}
  //         }),
  //         () => {
  //           observer.next({
  //             control_uuid: control_uuid,
  //             outcome: 'success',
  //             message:'Goal removed successfully.',
  //             context:{params:{navigate_to:'/teams'}}
  //           });
  //           observer.complete();
  //         }
  //       );
  //     }
  //   });
  //   return obs;
  // }

  public loadGoal(control_uuid: string, params: any): Observable<any> {
    let uuid: string = params.goal_uuid;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      let goal = this.service.retrieveGoal(uuid);
      if(goal.id) {
        this.service.storeGoal(goal);
        observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Goal Retrieved.',
              context:{params:{goal_loaded:uuid}}
        });
        observer.complete();
      } else {
        this.service.get(uuid).then(
          response => {
            this.service.storeGoal(response);
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Goal Loaded.',
              context:{params:{}}
            });
            observer.complete();
          }
        ).catch(
          error => observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'Goal Load Failed.',
              context:{params:{}}
          })
        );
      }
    });
    return obs;
  }

  public loadGoals(control_uuid: string, params: any): Observable<any> {
    let team: string = params.team;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(team).then(
        response => {
          let goals = <Goal[]>response.data;
          this.service.publishGoals(goals);
          observer.next({
                control_uuid: control_uuid,
                outcome: 'success',
                message:'Goal loaded successfully.',
                context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goals Load Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public createGoal(control_uuid: string, params: any): Observable<any> {
    let goal: Goal = params.goal;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(goal).then(
        response => {
          goal = <Goal>response.data;
          this.service.addGoal(goal);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Saved Successfully.',
            context:{params:{goal:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public createGoalFromTemplate(control_uuid: string, params: any): Observable<any> {
    let goalTemplate: GoalTemplate = params.goalTemplate;
    let user: User = params.user;
    let newGoal: Goal = JSON.parse(JSON.stringify(GoalStruct));
    let obs = new Observable((observer:any) => {
      newGoal.team_id = goalTemplate.team_id;
      newGoal.title = goalTemplate.title;
      newGoal.template_id = goalTemplate.id;
      this.service.setUser(user);
      this.service.post(newGoal).then(
        response => {
          let goal = <Goal>response.data;
          this.service.addGoal(goal);
          this.message.startProcess('navigate_to',{navigate_to:'goal/' + goal.id})
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Saved Successfully.',
            context:{params:{goal:response.data,goalTemplate:goalTemplate.id}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public deleteGoal(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(goal).then(
        response => {
          this.service.removeGoal(goal);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Remove Successfully.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Remove Failed. You can only delete empty Goals.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public saveGoal(control_uuid: string, params: any): Observable<any> {
    let goal: Goal = params.goal;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(goal).then(
        response => {
          goal = <Goal>response.data;
          this.service.updateGoal(goal);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Saved Successfully.',
            context:{params:{goal:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

}
