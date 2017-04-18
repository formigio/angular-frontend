import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessContext,
  ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
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

  public workQueue: ReplaySubject<any> = new ReplaySubject(1);

  public routines: {} = {
      goal_delete: new ProcessRoutine(
          'goal_delete',
          'The Process Used to Control the Deletion of Goals'
      ),
      goal_view: new ProcessRoutine(
          'goal_view',
          'The Process Used to Control the Viewing of Goals'
      ),
      load_goal_list: new ProcessRoutine(
          'load_goal_list',
          'The Process Used to Control the Viewing of Goals'
      ),
      create_goal: new ProcessRoutine(
          'create_goal',
          'The Process Used to Control the Creating of Goals'
      ),
      goal_save: new ProcessRoutine(
          'goal_save',
          'The Process Used to Control the Saving of Goals'
      ),
      goal_save_template_from_goal: new ProcessRoutine(
          'goal_save_template_from_goal',
          'The Process Used to Control the Saving of Goal Templates'
      )
  };

  public tasks: {} = {
      get_user_for_goal_template_to_goal_complete: new ProcessTask(
          'create_goal_from_template',
          'get_user_for_goal_template_to_goal_complete',
          'goal_template_to_goal',
          'Create Goal from Template',
          'createGoalFromTemplate',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_goal_template_to_goal_complete');
            },
          {goalTemplate:'GoalTemplate',user:'User'}
      ),
      remove_invites_complete: new ProcessTask(
          'remove_goal',
          'remove_invites_complete',
          'goal_delete',
          'Delete Goal',
          'removeGoal',
            (context:ProcessContext) => {
              return context.hasSignal('remove_invites_complete');
            },
          {goal:'string', invite_count:'string', task_count:'string'}
      ),
      get_user_for_view_goal_complete: new ProcessTask(
          'load_goal',
          'get_user_for_view_goal_complete',
          'goal_view',
          'Load Goal',
          'loadGoal',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_view_goal_complete');
            },
          {goal_uuid:'string',user:'User'}
      ),
      get_user_for_load_goals_complete: new ProcessTask(
          'load_team_goals',
          'get_user_for_load_goals_complete',
          'load_goal_list',
          'Load Goals',
          'loadGoals',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_load_goals_complete');
            },
          {team:'string',user:'User'}
      ),
      get_user_for_create_goal_complete: new ProcessTask(
          'create_goal_task',
          'get_user_for_create_goal_complete',
          'create_goal',
          'Create Goal',
          'createGoal',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_create_goal_complete');
            },
          {goal:'Goal',user:'User'}
      ),
      get_user_for_goal_save_complete: new ProcessTask(
          'put_goal_task',
          'get_user_for_goal_save_complete',
          'goal_save',
          'Save Goal',
          'saveGoal',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_goal_save_complete');
            },
          {goal:'Goal',user:'User'}
      ),
      get_user_for_goal_delete_complete: new ProcessTask(
          'delete_goal_task',
          'get_user_for_goal_delete_complete',
          'goal_delete',
          'Delete Goal',
          'deleteGoal',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_goal_delete_complete');
            },
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
          this.message.startProcess('navigate_to',{navigate_to:'goal/' + goal.id});
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
