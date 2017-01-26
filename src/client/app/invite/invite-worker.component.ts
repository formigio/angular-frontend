import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
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
        ),
        invite_fetch: new ProcessRoutine(
            'invite_fetch',
            'The Process Used to Control the Fetch of Invites',
            new ProcessContext,
            ''
        ),
        invite_create: new ProcessRoutine(
          'invite_create',
          'The Process Used to Control the Creation of Invites',
          new ProcessContext,
          ''
        ),
        invite_view: new ProcessRoutine(
          'invite_view',
          'The Process Used to Control the View of Invite',
          new ProcessContext,
          ''
        ),
        invite_accept: new ProcessRoutine(
          'invite_accept',
          'The Process Used to Control the Acceptance of an Invite',
          new ProcessContext,
          ''
        )
    };

    public tasks: {} = {
        get_user_for_invite_delete_complete: new ProcessTask(
            'delete_invite',
            'get_user_for_invite_delete_complete',
            'Delete Invite',
            'deleteInvite',
            {user:'User',invite:'Invite'}
        ),
        remove_tasks_complete: new ProcessTask(
            'gather_goal_invites',
            'remove_tasks_complete',
            'Gather Goal Invites',
            'gatherInvites',
            {entity:'string',entity_id:'string',status:'string'}
        ),
        gather_goal_invites_complete: new ProcessTask(
            'remove_invites',
            'gather_goal_invites_complete',
            'Remove Invites for a specific goal',
            'removeInvites',
            {goal:'string', invite_count:'string'}
        ),
        get_user_for_invite_fetch_complete: new ProcessTask(
            'gather_invites_for_invite_fetch',
            'get_user_for_invite_fetch_complete',
            'Fetch Invites for a specific goal',
            'gatherInvites',
            {entity:'string',entity_id:'string',user:'User'}
        ),
        gather_invites_for_invite_fetch_complete: new ProcessTask(
            'publish_invites',
            'gather_invites_for_invite_fetch_complete',
            'Publish Invites for a specific goal',
            'publishInvites',
            {invites:'Invite'}
        ),
        get_user_for_invite_create_complete: new ProcessTask(
            'create_invite',
            'get_user_for_invite_create_complete',
            'Create Invite',
            'createInvite',
            {invite:'Invite',user:'User'}
        ),
        get_user_for_invite_view_complete: new ProcessTask(
            'load_invite',
            'get_user_for_invite_view_complete',
            'Load Invite',
            'loadInvite',
            {hash:'string',user:'User'}
        ),
        load_invite_complete: new ProcessTask(
            'link_invite',
            'load_invite_complete',
            'Link Invite',
            'linkInvite',
            {invite:'Invite',user:'User'}
        ),
        get_user_for_invite_accept_complete: new ProcessTask(
            'accept_invite',
            'get_user_for_invite_accept_complete',
            'Load Invite',
            'acceptInvite',
            {invite:'Invite',user:'User'}
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
    let entity: string = params.entity;
    let entity_id: string = params.entity_id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(entity,entity_id).then(
        response => {
          let invites = <Invite[]>response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invites fetched successfully.',
            context:{params:{invites:invites,invite_count:invites.length}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the invites.'
          });
        }
      );
    });

    return obs;
  }

  public loadInvite(control_uuid: string, params: any): Observable<any> {
    let hash: string = params.hash;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.get(hash).then(
        response => {
          let invite = <Invite>(<any>response).data;
          if(invite.id === null || invite.id === '') {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'Invalid or Expired Invitation.'
            });
          } else {
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Invite fetched successfully.',
              context:{params:{invite:invite}}
            });
            observer.complete();
          }
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching the invites.'
          });
        }
      );
    });

    return obs;
  }

  public createInvite(control_uuid: string, params: any): Observable<any> {
    let invite: Invite = params.invite;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      invite.inviter_name = user.worker.name;
      invite.inviter_worker_id = user.worker.id;
      this.service.post(invite).then(
        response => {
          let invite = <Invite>response.data;
          this.service.addInvite(invite);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invite Created.',
            context:{params:{invite:invite}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured saving the invite.'
          });
        }
      );
    });

    return obs;
  }

  public acceptInvite(control_uuid: string, params: any): Observable<any> {
    let invite: Invite = params.invite;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      invite.status = 'accepted';
      this.service.setUser(user);
      this.service.put(invite).then(
        response => {
          let invite = <Invite>response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invite Marked Accepted.',
            context:{params:{invite:invite}}
          });
          observer.complete();
          this.message.startProcess('navigate_to',{navigate_to:'/teams'});
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured. Please check to make sure you are not already a member of this team.'
          });
        }
      );
    });

    return obs;
  }

  public linkInvite(control_uuid: string, params: any): Observable<any> {
    let invite: Invite = params.invite;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      if(invite.invitee_worker_id && invite.invitee_worker_id !== user.worker.id) {
        observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'This Invite has expired or is invalid.'
        });
      } else if(invite.inviter_worker_id === user.worker.id) {
        observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'You cannot create a link to an invite that you created.'
        });
      } else {
        invite.invitee_worker_id = user.worker.id;
        invite.invitee_name = user.worker.name;
        this.service.setUser(user);
        this.service.put(invite).then(
          response => {
            let invite = <Invite>response.data;
            this.service.publishInvite(invite);
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Invite Created.',
              context:{params:{invite:invite}}
            });
            observer.complete();
          }
        ).catch(
          error => {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'An error has occured saving the invite.'
            });
          }
        );
      }
    });
    return obs;
  }

  public publishInvites(control_uuid: string, params: any): Observable<any> {
    let invites: Invite[] = params.invites;
    let obs = new Observable((observer:any) => {
      this.service.publishInvites(invites);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message: 'Invites Published.',
        context:{params:{}}
      });
      observer.complete();
    });

    return obs;
  }

  public deleteInvite(control_uuid: string, params: any): Observable<any> {
    let invite: Invite = params.invite;
    let obs = new Observable((observer:any) => {
      this.service.delete(invite.id).then(
        response => {
          this.service.removeInvite(invite.id);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Invite Removed.',
            context:{params:{invite_deleted:invite.id}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured removing the invite.'
          });
        }
      );
    });
    return obs;
  }

  // public removeInvites(control_uuid: string, params: any): Observable<any> {
  //   let invites: Invite[] = params.invites;
  //   let invitesRemoved: string[] = [];
  //   let obs = new Observable((observer:any) => {
  //     if(invites.length === 0) {
  //       observer.next({
  //         control_uuid: control_uuid,
  //         outcome: 'success',
  //         message:'No Tasks to Remove.',
  //         context:{params:{invite_count:0}}
  //       });
  //       observer.complete();
  //     }
  //     invites.forEach((invite) => {
  //       this.service.delete(invite).subscribe(
  //         null,
  //         error => observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'Error has occured while removing invites.',
  //           context:{params:{}}
  //         }),
  //         () => {
  //           invitesRemoved.push(invite.uuid);
  //           if(invites.length === invitesRemoved.length) {
  //             observer.next({
  //               control_uuid: control_uuid,
  //               outcome: 'success',
  //               message:'Invites removed successfully.',
  //               context:{params:{invite_count:0}}
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
