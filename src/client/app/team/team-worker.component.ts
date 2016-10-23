import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
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
            'The Process Used to Loading of Team Entity from View Url',
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
            {team:'Team', user:'User'}
        ),
        get_user_for_create_team_complete: new ProcessTask(
            'create_team',
            'get_user_for_create_team_complete',
            'Create Team',
            'createTeam',
            {team:'Team', user:'User'}
        ),
        team_view_init: new ProcessTask(
            'load_team',
            'team_view_init',
            'Load Team',
            'loadTeam',
            {uuid:'string'}
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
          this.service.publishTeams();
          observer.complete();
        }
      );
    });
    return obs;
  }

  public saveTeam(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let user: User = params.user;
    team.user = user.uuid;
    let obs = new Observable((observer:any) => {
      this.service.put(team).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while saving team.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Saved successfully.',
            context:{params:{team_saved:team.uuid}}
          });
          observer.complete();
        }
      );
    });
    return obs;
  }

  public createTeam(control_uuid: string, params: any): Observable<any> {
    let team: Team = params.team;
    let user: User = params.user;
    team.user = user.uuid;
    let obs = new Observable((observer:any) => {
      this.service.post(team).subscribe(
        response => team.isNew = false,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while saving team.',
          context:{params:{}}
        }),
        () => {
          this.service.publishTeams();
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Created successfully.',
            context:{params:{team_created:team.uuid}}
          });
          observer.complete();
        }
      );
    });
    return obs;
  }

  public loadTeam(control_uuid: string, params: any): Observable<any> {
    let uuid: string = params.uuid;
    let obs = new Observable((observer:any) => {
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
}
