import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessContext,
  ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
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

    public workQueue: ReplaySubject<any> = new ReplaySubject(1);

    public routines: {} = {
        commitment_create: new ProcessRoutine(
            'commitment_create',
            'The Process Used to Control the Creating a Commitment'
        ),
        commitment_save: new ProcessRoutine(
            'commitment_save',
            'The Process Used to Control the Save a Commitment'
        ),
        commitment_delete: new ProcessRoutine(
            'commitment_delete',
            'The Process Used to Control the Deleting a Commitment'
        ),
        commitment_load_commitments: new ProcessRoutine(
            'commitment_load_commitments',
            'The Process Used to Control the Load Commitments'
        ),
        commitment_load_worker_commitments: new ProcessRoutine(
            'commitment_load_worker_commitments',
            'The Process Used to Control the Load Commitments'
        ),
        commitment_task_save: new ProcessRoutine(
            'commitment_task_save',
            'The Process Used to Control the Saving a Task from Commitment'
        )
    };

    public tasks: {} = {
        get_user_for_load_worker_commitments_complete: new ProcessTask(
            'load_worker_commitments',
            'get_user_for_load_worker_commitments_complete',
            'commitment_load_worker_commitments',
            'Fetch Worker Commitments',
            'loadWorkerCommitments',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_load_worker_commitments_complete');
            },
            {user:'User',workerId:'string'}
        ),
        get_user_for_load_commitments_complete: new ProcessTask(
            'load_commitments',
            'get_user_for_load_commitment_list_complete',
            'commitment_load_commitments',
            'Fetch Commitments',
            'loadCommitments',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_load_commitments_complete');
            },
            {user:'User'}
        ),
        get_user_for_commitment_create_complete: new ProcessTask(
            'create_commitment',
            'get_user_for_commitment_create_complete',
            'commitment_create',
            'Create Commitment',
            'createCommitment',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_commitment_create_complete');
            },
            {commitment:'Commitment',user:'User'}
        ),
        get_user_for_commitment_save_complete: new ProcessTask(
            'save_commitment',
            'get_user_for_commitment_save_complete',
            'commitment_save',
            'Save Commitment',
            'saveCommitment',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_commitment_save_complete');
            },
            {commitment:'Commitment',user:'User'}
        ),
        get_user_for_commitment_delete_complete: new ProcessTask(
            'delete_commitment',
            'get_user_for_commitment_delete_complete',
            'commitment_delete',
            'Delete Commitment',
            'deleteCommitment',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_commitment_delete_complete');
            },
            {commitment:'Commitment',user:'User'}
        ),
        save_task_from_commitment_complete: new ProcessTask(
            'load_commitments_after_task_save',
            'save_task_from_commitment_complete',
            'commitment_task_save',
            'Load Commitments',
            'loadCommitments',
            (context:ProcessContext) => {
              return context.hasSignal('save_task_from_commitment_complete');
            },
            {user:'User'}
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
          task.commitment_promised_start = commitment.promised_start;
          task.commitment_worker_id = commitment.worker_id;
          task.commitment_worker_name = user.worker.name;
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
          this.service.publishCommitment(commitment);
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
            message:'Commitment Removed.',
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
            message:'Commitments Fetched.',
            context:{params:{commitments:commitments}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching Commitments.'
          });
        }
      );
    });

    return obs;
  }

  public loadWorkerCommitments(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let workerId: string = params.workerId;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.listCommitmentByWorker(workerId).then(
        response => {
          let data = response.data;
          this.service.publishCommitments(data);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Commitments Fetched.',
            context:{params:{commitments:data.commitments}}
          });
          observer.complete();
        }
      ).catch(
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured fetching Commitments.'
          });
        }
      );
    });

    return obs;
  }
}
