import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, ProcessMessage, WorkerMessage, WorkerResponse } from '../core/index';
import { HelperService } from '../shared/index';
import { Invite, InviteService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-worker',
  template: `<div>Invite Worker</div>`,
  providers: [ InviteService ]
})
export class InviteWorkerComponent implements OnInit {

    protected routines: {} = {
        invite_delete: new ProcessRoutine(
            'invite_delete',
            'The Process Used to Control the Deletion of Invites',
            new ProcessContext,
            ''
        )
    };

    protected tasks: {} = {
        invite_delete_init: new ProcessTask(
            'delete_invite',
            'invite_delete_init',
            'Delete Invite',
            'deleteInvite',
            {invite:'Invite'}
        ),
        goal_delete_init: new ProcessTask(
            'gather_goal_invites',
            'goal_delete_init',
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
    protected message: MessageService
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
            this.processSignal(message);
          }
        );
      }
      if(Object.keys(this.routines).length > 0) {
        this.message.getProcessQueue().subscribe(
          message => {
            // Process Signals
            this.initProcess(message);
          }
        );
      }
  }

  public gatherInvites(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    console.log('Fetching Invite Count for: ' + goal);
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
      return () => console.log('Observer Created for Working.');
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


  // Functions Below should be in a shared parent class...
  // but the class inheritance doesn't work as expected in Angular2

    public createContextParams(params:{}): ProcessContext {
        return new ProcessContext(params);
    }

    public initProcess(processMessage: ProcessMessage): boolean {
        let identifier = processMessage.routine;
        let params = processMessage.params;
        let control_uuid: string = Math.random().toString().split('.').pop().toString();
        let context = this.createContextParams(params);

        if(!this.routines.hasOwnProperty(identifier)) {
            this.message.setFlash('Error - Initiating Process: ' + identifier + ' No Routine Found.','warning');
            return false;
        }

        let processRoutine: ProcessRoutine = (<any>this.routines)[identifier];
        this.message.addProcessMessage('Initiating Process: ' + processRoutine.description);
        processRoutine.control_uuid = control_uuid;
        processRoutine.context = context;
        localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));

        this.message.processSignal(new WorkerMessage(identifier + '_init', control_uuid));

        return true;
    }

  public processSignal(message:WorkerMessage): boolean {
    let signal = message.signal;
    let control_uuid = message.control_uuid;

      // Verify the Worker has a Task
      if(!this.tasks.hasOwnProperty(signal)) {
          console.log('No Task: ' + signal + ' Found in the Goal Worker Class.');
          return false;
      }

      // Get the processRoutine from local storage
      let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));

      // Initiate ProcessTask
      let processTask: ProcessTask = (<any>this.tasks)[signal];

      this.message.addProcessMessage('Initiating Task: ' + processTask.description + ' Process: '
          + processRoutine.identifier + ' Context: ' + JSON.stringify(processRoutine.context));

      // Verify Required Process Params are in place
      let paramProcessor: Observable<any> = processTask.processRoutineHasRequiredParams(processRoutine);
      paramProcessor.subscribe(
          result => console.log('Subscribe Result:' + result),
          error => {
              this.message.addProcessMessage('missing required params: ' + error);
          },
          () => {
              this.message.addProcessMessage('required params checked.');
              let workerMethod: Observable<any> = (<any>this)[processTask.method](
                  processRoutine.control_uuid, processRoutine.context.params);
              let workerResponse: WorkerResponse;
              let workerMessage: WorkerMessage = new WorkerMessage('',control_uuid);

              workerMethod.subscribe(
                  response => workerResponse = response,
                  error => {
                      workerMessage.signal = processTask.identifier + '_error';
                      this.message.addProcessMessage('Worker Error: ' + JSON.stringify(error.message));
                      this.message.processSignal(workerMessage);
                  },
                  () => {
                      workerMessage.signal = processTask.identifier + '_complete';
                      this.message.addProcessMessage('Worker Response: ' + JSON.stringify(workerResponse.message));
                      processTask.updateProcessAfterWork(control_uuid, workerResponse.context).subscribe(
                          null,
                          null,
                          () => this.message.processSignal(workerMessage)
                      );
                  }
              );
          }
      );

      return true;
  }



}
