import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, ProcessMessage, WorkerMessage, WorkerResponse } from '../core/index';
import { GoalService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-worker',
  template: `<div>Goal Worker</div>`,
  providers: [ GoalService ]
})
export class GoalWorkerComponent implements OnInit {

  protected routines: {} = {
      goal_delete: new ProcessRoutine(
          'goal_delete',
          'The Process Used to Control the Deletion of Goals',
          new ProcessContext,
          ''
      )
  };

  protected tasks: {} = {
      remove_tasks_complete: new ProcessTask(
          'remove_goal',
          'remove_tasks_complete',
          'Delete Goal',
          'removeGoal',
          {goal:'string', task_count:'string'}
      )
  };

  constructor(
    protected service: GoalService,
    protected message: MessageService
  ) {}

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

  protected removeGoal(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: number = params.task_count;
    let obs = new Observable((observer:any) => {
      if(taskCount > 0) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'You can only delete a goal, when it is empty. taskCount:' + taskCount,
          context:{params:{}}
        });
      } else {
        this.service.delete(goal).subscribe(
          null,
          error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'An error has occured during Goal delete',
            context:{params:{}}
          }),
          () => {
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Goal removed successfully.',
              context:{params:{navigate_to:'/goals'}}
            });
            observer.complete();
          }
        );
      }
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
          console.log('No Task Found in the Goal Worker Class.');
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
