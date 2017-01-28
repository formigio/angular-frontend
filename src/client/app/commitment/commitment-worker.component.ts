import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
import { Task } from '../task/index';
import { Commitment, CommitmentService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'commitment-worker',
  template: `<div></div>`,
  providers: [ CommitmentService ]
})
export class CommitmentWorkerComponent implements OnInit, WorkerComponent {

    public routines: {} = {
        commitment_create: new ProcessRoutine(
            'commitment_create',
            'The Process Used to Control the Creating a Commitment',
            new ProcessContext,
            ''
        ),
        commitment_save: new ProcessRoutine(
            'commitment_save',
            'The Process Used to Control the Save a Commitment',
            new ProcessContext,
            ''
        ),
        commitment_delete: new ProcessRoutine(
            'commitment_delete',
            'The Process Used to Control the Deleting a Commitment',
            new ProcessContext,
            ''
        ),
        load_commitments: new ProcessRoutine(
            'commitment_save',
            'The Process Used to Control the Load Commitments',
            new ProcessContext,
            ''
        )
    };

    public tasks: {} = {
        get_user_for_load_commitments_complete: new ProcessTask(
            'load_commitments',
            'get_user_for_load_commitment_list_complete',
            'Fetch Commitments',
            'loadCommitments',
            {user:'User'}
        ),
        get_user_for_commitment_create_complete: new ProcessTask(
            'create_commitment',
            'get_user_for_commitment_create_complete',
            'Create Commitment',
            'createCommitment',
            {commitment:'Commitment',user:'User'}
        ),
        get_user_for_commitment_save_complete: new ProcessTask(
            'save_commitment',
            'get_user_for_commitment_save_complete',
            'Save Commitment',
            'saveCommitment',
            {commitment:'Commitment',user:'User'}
        ),
        get_user_for_commitment_delete_complete: new ProcessTask(
            'delete_commitment',
            'get_user_for_commitment_delete_complete',
            'Delete Commitment',
            'deleteCommitment',
            {commitment:'Commitment',user:'User'}
        )
    };

  constructor(
    protected service: CommitmentService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'CommitmentService');
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

  public createCommitment(control_uuid: string, params: any): Observable<any> {
    let commitment: Commitment = params.commitment;
    let task: Task = params.task;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      commitment.task_id = task.id;
      commitment.worker_id = user.worker.id;
      this.service.setUser(user);
      this.service.post(commitment).then(
        response => {
          let commitment = <Commitment>response.data;
          task.changed = false;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Commitment Created.',
            context:{params:{commitment:commitment,task:task}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured creating Commitment.'
          });
        }
      );
    });

    return obs;
  }

  public saveCommitment(control_uuid: string, params: any): Observable<any> {
    let commitment: Commitment = params.commitment;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(commitment).then(
        response => {
          let commitment = <Commitment>response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Commitment Saved.',
            context:{params:{commitment:commitment}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured saving the Commitment.'
          });
        }
      );
    });

    return obs;
  }

  public deleteCommitment(control_uuid: string, params: any): Observable<any> {
    let commitment: Commitment = params.commitment;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(commitment.id).then(
        response => {
          this.service.removeCommitment(commitment.id);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Commitment Remove.',
            context:{params:{commitment:commitment}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured saving the Commitment.'
          });
        }
      );
    });

    return obs;
  }

  public loadCommitments(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list().then(
        response => {
          let commitments = <Commitment[]>response.data;
          this.service.publishCommitments(commitments);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Commitment Fetched.',
            context:{params:{commitments:commitments}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching Commitment.'
          });
        }
      );
    });

    return obs;
  }

}
