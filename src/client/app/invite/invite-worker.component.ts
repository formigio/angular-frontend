import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
import { Invite, InviteService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-worker',
  template: `<div></div>`,
  providers: [ InviteService ]
})
export class InviteWorkerComponent implements OnInit, WorkerComponent {

    public routines: {} = {
        invite_delete: new ProcessRoutine(
            'invite_delete',
            'The Process Used to Control the Deletion of Invites',
            new ProcessContext,
            ''
        )
    };

    public tasks: {} = {
        invite_delete_init: new ProcessTask(
            'delete_invite',
            'invite_delete_init',
            'Delete Invite',
            'deleteInvite',
            {invite:'Invite'}
        ),
        remove_tasks_complete: new ProcessTask(
            'gather_goal_invites',
            'remove_tasks_complete',
            'Gather Goal Invites',
            'gatherInvites',
            {goal:'string'}
        ),
        gather_goal_invites_complete: new ProcessTask(
            'remove_invites',
            'gather_goal_invites_complete',
            'Remove Invites for a specific goal',
            'removeInvites',
            {goal:'string', invite_count:'string'}
        )
    };

  constructor(
    protected service: InviteService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'InviteService');
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

  public gatherInvites(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let obs = new Observable((observer:any) => {
      this.service.list(goal).subscribe(
        invites => {
          invites = <Invite[]>invites;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invites fetched successfully.',
            context:{params:{invites:invites,invite_count:invites.length}}
          });
        },
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the invites.'
          });
        },
        () => observer.complete()
      );
    });

    return obs;
  }

  public deleteInvite(control_uuid: string, params: any): Observable<any> {
    let invite: Invite = params.invite;
    let obs = new Observable((observer:any) => {
      this.service.delete(invite).subscribe(
        null,
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while removing invite.',
          context:{params:{}}
        }),
        () => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invite removed successfully.',
            context:{params:{invite_deleted:invite.uuid}}
          });
          this.service.refreshInvites(invite.goal);
          observer.complete();
        }
      );
    });
    return obs;
  }

  public removeInvites(control_uuid: string, params: any): Observable<any> {
    let invites: Invite[] = params.invites;
    let invitesRemoved: string[] = [];
    let obs = new Observable((observer:any) => {
      if(invites.length === 0) {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'No Tasks to Remove.',
          context:{params:{invite_count:0}}
        });
        observer.complete();
      }
      invites.forEach((invite) => {
        this.service.delete(invite).subscribe(
          null,
          error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Error has occured while removing invites.',
            context:{params:{}}
          }),
          () => {
            invitesRemoved.push(invite.uuid);
            if(invites.length === invitesRemoved.length) {
              observer.next({
                control_uuid: control_uuid,
                outcome: 'success',
                message:'Invites removed successfully.',
                context:{params:{invite_count:0}}
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
