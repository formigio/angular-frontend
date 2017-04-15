import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessContext,
  ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
import { Team, TeamService } from './index';
import { User } from '../user/index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-worker',
  template: `<div></div>`,
  providers: [ TeamService ]
})
export class TeamWorkerComponent implements OnInit, WorkerComponent {

    public workQueue: ReplaySubject<any> = new ReplaySubject(1);

    public routines: {} = {
        team_delete: new ProcessRoutine(
            'team_delete',
            'The Process Used to Control the Deletion of Teams'
        ),
        team_save: new ProcessRoutine(
            'team_save',
            'The Process Used to Control the Saving of Teams'
        ),
        team_create: new ProcessRoutine(
            'team_create',
            'The Process Used to Control the Creating of Teams'
        ),
        team_view: new ProcessRoutine(
            'team_view',
            'The Process Used for Loading of Team Entity from View Url'
        ),
        team_fetch_user_teams: new ProcessRoutine(
            'team_fetch_user_teams',
            'The Process Used to Teams for the Logged in User'
        )

    };

    public tasks: {} = {
        get_user_for_delete_team_complete: new ProcessTask(
            'delete_team',
            'get_user_for_delete_team_complete',
            'team_delete',
            'Delete Team',
            'deleteTeam',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_delete_team_complete');
            },
            {user:'User',team:'Team'}
        ),
        get_user_for_save_team_complete: new ProcessTask(
            'save_team',
            'get_user_for_save_team_complete',
            'team_save',
            'Save Team',
            'saveTeam',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_save_team_complete');
            },
            {team:'Team',user:'User'}
        ),
        get_user_for_create_team_complete: new ProcessTask(
            'create_team',
            'get_user_for_create_team_complete',
            'team_create',
            'Create Team',
            'createTeam',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_create_team_complete');
            },
            {team:'Team'}
        ),
        get_user_for_view_team_complete: new ProcessTask(
            'load_team',
            'get_user_for_view_team_complete',
            'team_view',
            'Load Team',
            'loadTeam',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_view_team_complete');
            },
            {uuid:'string', user:'User'}
        ),
        get_user_for_fetch_teams_complete: new ProcessTask(
            'fetch_teams',
            'get_user_for_fetch_teams_complete',
            'team_fetch_user_teams',
            'Fetch Teams',
            'fetchUserTeams',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_fetch_teams_complete');
            },
            {user:'User'}
        )
    };

  constructor(
    protected service: TeamService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamService');
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
          workMessage.routine.log('team worker - executing...');
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

  public deleteTeam(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let team: Team = params.team;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(team.id).then((response:any) => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team removed.',
            context:{params:{}}
          });
          observer.complete();
          this.service.removeTeam(team.id);
        }).catch((error:any) => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: 'Team delete failed, We cannot delete a team that still has goals.',
            context:{
              params:{}
            }
        });
      });
    });
    return obs;
  }

  public saveTeam(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(team).then(
        response => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Saved successfully.',
            context:{params:{team_saved:team.id}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while saving team.',
          context:{params:{}}
        })
      );
    });
    return obs;
  }

  public createTeam(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(team)
        .then((response:any) => {
          team = response.data;
          this.service.addTeam(team);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Created successfully.',
            context:{params:{team_created:team.id}}
          });
          observer.complete();
        }).catch((response:any) => {
          console.log(response);
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message:'Error has occured while saving team.',
           context:{params:{}}
          });
        });
    });
    return obs;
  }

  public loadTeam(control_uuid: string, params: any): Observable<any> {
    let uuid: string = params.uuid;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.publishTeam(uuid);
      observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team loaded successfully.',
            context:{params:{team_loaded:uuid}}
      });
      observer.complete();
    });
    return obs;
  }

  public fetchUserTeams(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let loadedTeams: Team[];
    let obs = new Observable((observer:any) => {
      this.service.list(user).then((response:any) => {
          loadedTeams = response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Teams loaded successfully.',
            context:{params:{teams_loaded:true}}
          });
          this.service.publishTeams(loadedTeams);
          observer.complete();
        }).catch((error:any) => {
          let message = 'Teams Load Failed. ('+ error +')';
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: message,
            context:{
              params:{}
            }
        });
      });
    });
    return obs;
  }

}
