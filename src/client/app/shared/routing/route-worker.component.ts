import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask,
    ProcessMessage, WorkerMessage, WorkerResponse } from '../../core/index';
import { HelperService } from '../index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'route-worker',
  template: `<div>Route Worker</div>`,
  providers: [ ]
})
export class RouteWorkerComponent implements OnInit {

  protected routines: {} = {};

  protected tasks: {} = {
      remove_goal_complete: new ProcessTask(
          'navigate',
          'remove_goal_complete',
          'Navigate to Goals after Goal Delete',
          'navigateTo',
          {navigate_to:'string'}
      )
  };

  constructor(
    protected message: MessageService,
    protected helper: HelperService
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

  public navigateTo(control_uuid: string, params: any): Observable<any> {
    let navigate_to: string = params.navigate_to;
    let obs = new Observable((observer:any) => {
        this.helper.router.navigate([navigate_to]);
      observer.next({control_uuid: control_uuid, outcome: 'success', message:'Nagivated.',context:{params:{}}});
      observer.complete();
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
