import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { Team, TeamMembership, TeamService } from './index';
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

    public routines: {} = {
        team_delete: new ProcessRoutine(
            'team_delete',
            'The Process Used to Control the Deletion of Teams',
            new ProcessContext,
            ''
        ),
        team_save: new ProcessRoutine(
            'team_save',
            'The Process Used to Control the Saving of Teams',
            new ProcessContext,
            ''
        ),
        team_create: new ProcessRoutine(
            'team_create',
            'The Process Used to Control the Creating of Teams',
            new ProcessContext,
            ''
        ),
        team_view: new ProcessRoutine(
            'team_view',
            'The Process Used for Loading of Team Entity from View Url',
            new ProcessContext,
            ''
        ),
        team_fetch_user_teams: new ProcessRoutine(
            'team_fetch_user_teams',
            'The Process Used to Teams for the Logged in User',
            new ProcessContext,
            ''
        )

    };

    public tasks: {} = {
        team_delete_init: new ProcessTask(
            'delete_team',
            'team_delete_init',
            'Delete Team',
            'deleteTeam',
            {team:'Team'}
        ),
        get_user_for_save_team_complete: new ProcessTask(
            'save_team',
            'get_user_for_save_team_complete',
            'Save Team',
            'saveTeam',
            {team:'Team',user:'User'}
        ),
        get_user_for_create_team_complete: new ProcessTask(
            'create_team',
            'get_user_for_create_team_complete',
            'Create Team',
            'createTeam',
            {team:'Team'}
        ),
        // create_team_complete: new ProcessTask(
        //     'create_team_membership',
        //     'create_team_complete',
        //     'Create Team Membership',
        //     'saveTeamMembership',
        //     {team:'Team', user:'User'}
        // ),
        // prepare_team_membership_complete: new ProcessTask(
        //     'save_team_member',
        //     'prepare_team_membership_complete',
        //     'Save Team Member',
        //     'saveTeamMembership',
        //     {team:'Team', user:'User'}
        // ),
        // validate_user_as_teammember_complete: new ProcessTask(
        //     'prepare_team_membership',
        //     'validate_user_as_teammember_complete',
        //     'Prepare Team Membership Data',
        //     'prepareTeamMembership',
        //     {team_uuid:'string', user_uuid:'string', user_email:'string'}
        // ),
        get_user_for_view_team_complete: new ProcessTask(
            'load_team',
            'team_view_init',
            'Load Team',
            'loadTeam',
            {uuid:'string', user:'User'}
        ),
        get_user_for_fetch_teams_complete: new ProcessTask(
            'fetch_teams',
            'get_user_for_fetch_teams_complete',
            'Fetch Teams',
            'fetchUserTeams',
            {user:'User'}
        ),
        fetch_teams_error: new ProcessTask(
            'handle_team_fetch_error',
            'fetch_teams_error',
            'Fetch Teams - Error Handler',
            'handleFetchTeamsError',
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

  public deleteTeam(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let obs = new Observable((observer:any) => {
      this.service.delete(team.uuid).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while removing team.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team removed successfully.',
            context:{params:{team_deleted:team.uuid}}
          });
          observer.complete();
        }
      );
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
            context:{params:{team_saved:team.uuid}}
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
          team.isNew = false;
          observer.next({
            control_uuid: control_uuid,
           outcome: 'success',
           message:'Team Created successfully.',
           context:{params:{team_created:team.uuid}}
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

  public saveTeamMembership(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let user: User = params.user;
    let membership: TeamMembership = {
      team_uuid: team.uuid,
      user_uuid: user.uuid,
      team_doc: team,
      user_doc: user
    };
    let obs = new Observable((observer:any) => {
      this.service.postMembership(membership).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while saving team membership.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Membership Saved.',
            context:{params:{team_membership_saved: true}}
          });
          observer.complete();
        }
      );
    });
    return obs;
  }

  public prepareTeamMembership(control_uuid: string, params: any): Observable<any> {
    // let team_uuid: string = params.team_uuid;
    // let user_uuid: string = params.user_uuid;
    // let user_email: string = params.user_email;
    // let userDoc: User = JSON.parse(JSON.stringify({uuid:user_uuid,email:user_email}));
    // let teamDoc: Team;

    let obs = new Observable((observer:any) => {
      // this.service.get(team_uuid).subscribe(
      //   team => teamDoc = team,
      //   error => observer.error({
      //     control_uuid: control_uuid,
      //     outcome: 'error',
      //     message:'Error has occured while preparing team membership.',
      //     context:{params:{}}
      //   }),
      //   () => {
      //     observer.next({
      //       control_uuid: control_uuid,
      //       outcome: 'success',
      //       message:'Team Membership Prepared.',
      //       context:{params:{user: userDoc, team: teamDoc}}
      //     });
      //     observer.complete();
      //   }
      // );
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
          let message = 'Teams Load Failed.';
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

  public handleFetchTeamsError(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.auth(user).then((response:any) => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Auth successful.',
            context:{params:{}}
          });
          observer.complete();
        }).catch((error:any) => {
          let message = 'Auth Test Failed.';
          if(error.status === 403) {
            message = 'User Login Required';
            this.message.startProcess('user_logout',{});
          }
          if(error.status === 0) {
            message = 'Network Error';
          }
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
