import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
import { TeamMember, TeamMemberService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-member-worker',
  template: `<div></div>`,
  providers: [ TeamMemberService ]
})
export class TeamMemberWorkerComponent implements OnInit, WorkerComponent {

    public routines: {} = {
        teammember_delete: new ProcessRoutine(
            'teammember_delete',
            'The Process Used to Control the Deletion of TeamMember',
            new ProcessContext,
            (context:ProcessContext) => { return false; },
            ''
        ),
        teammember_add: new ProcessRoutine(
            'teammember_add',
            'The Process Used to Control the Adding of a TeamMember',
            new ProcessContext,
            (context:ProcessContext) => { return false; },
            ''
        ),
        teammember_fetch_team_members: new ProcessRoutine(
            'teammember_fetch',
            'The Process Used to Control the Fetching of TeamMembers',
            new ProcessContext,
            (context:ProcessContext) => { return false; },
            ''
        )
    };

    public tasks: {} = {
        teammember_delete_init: new ProcessTask(
            'delete_teammember',
            'teammember_delete_init',
            'Delete TeamMember',
            'deleteTeamMember',
            {teammember:'TeamMember'}
        ),
        teammember_add_init: new ProcessTask(
            'add_teammember',
            'teammember_add_init',
            'Add TeamMember',
            'addTeamMember',
            {teammember:'TeamMember'}
        ),
        teammember_fetch_team_members_init: new ProcessTask(
            'fetch_team_members',
            'teammember_fetch_init',
            'Fetch Team Members',
            'fetchTeamMembers',
            {team:'Team'}
        )
    };

  constructor(
    protected service: TeamMemberService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamMemberService');
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

  public deleteTeamMember(control_uuid: string, params: any): Observable<any> {
    let teammember: TeamMember = params.teammember;
    let obs = new Observable((observer:any) => {
      this.service.delete(teammember).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while removing team member.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Member removed successfully.',
            context:{params:{teammember_deleted:teammember.user_name}}
          });
          observer.complete();
        }
      );
    });
    return obs;
  }

  public addTeamMember(control_uuid: string, params: any): Observable<any> {
    let teammember: TeamMember = params.teammember;
    let obs = new Observable((observer:any) => {
      this.service.post(teammember).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while adding team member.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Member added successfully.',
            context:{params:{teammember_added:teammember.user_name}}
          });
          observer.complete();
        }
      );
    });
    return obs;
  }

  public fetchTeamMembers(control_uuid: string, params: any): Observable<any> {
    let team: string = params.team;
    let loadedMembers: TeamMember[];
    let obs = new Observable((observer:any) => {
      this.service.list(team).subscribe(
        members => {
          loadedMembers = members;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Members loaded successfully.',
            context:{params:{team_members_loaded:true}}
          });
        },
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Teams load failed: ' + error,
            context:{params:{}}
        }),
        () => {
          this.service.publishTeamMembers(loadedMembers);
          observer.complete();
        }
      );
    });
    return obs;
  }

}
