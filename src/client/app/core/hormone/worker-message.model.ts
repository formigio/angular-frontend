import { Observable } from 'rxjs';
import { ProcessTask, ProcessRoutine, WorkerComponent,
    WorkerResponse, Message } from '../index';

export class WorkerMessage {
    constructor(
        public task: ProcessTask,
        public control_uuid: string,
        public routine: ProcessRoutine
    ) {}

  public executeMethod(worker:WorkerComponent): boolean {
    let control_uuid = this.control_uuid;
    let processRoutine = this.routine;
    let processTask = this.task;
    if(processRoutine === null) {
        return false;
    }

    if(processTask.systemStatus === 'pending' && processTask.workStatus !== 'blocked') {
      processRoutine.log('Checking Params: ' + processTask.identifier);
      // Verify Required Process Params are in place
      let paramProcessor: Observable<any> = processTask.processRoutineHasRequiredParams(processRoutine);
      paramProcessor.subscribe(
          null,
          error => {
              worker.message.addStickyMessage('Error - Missing Param for Process: ' + error ,'warning');
              this.task.workStatus = 'blocked';
              processRoutine.context.signals.push(processTask.identifier + '_error');
              processRoutine.localDebug();
              worker.message.continueProcess(processRoutine);
          },
          () => {
              processTask.systemStatus = 'ready';
              processRoutine.context.signals.push(processTask.identifier + '_ready');
              processRoutine.localDebug();
              worker.message.continueProcess(processRoutine);
          }
      );
      return true;
    }

    if(processTask.systemStatus === 'ready' && processTask.workStatus === 'started') {
        // Process Loop Actively Checking
        return true;
    }

    if(processTask.systemStatus === 'ready' && processTask.workStatus === 'notstarted') {
        processTask.workStatus = 'started';
        processRoutine.log('Executing Method: ' + processTask.identifier + '::' + processTask.method);
        try {
            let workerMethod: Observable<any> = (<any>worker)[processTask.method](
                processRoutine.control_uuid, processRoutine.context.params);

            let workerResponse: WorkerResponse;

            workerMethod.subscribe(
                response => workerResponse = response,
                error => {
                    processRoutine.log('Error returned from Method: ' + processTask.identifier + '::' + processTask.method);
                    let errorMessage:Message;
                    errorMessage = new Message(error.message.message,'danger','sticky',error.message.channel);
                    worker.message.addMessage(errorMessage);
                    processTask.workStatus = 'blocked';
                    processRoutine.context.signals.push(processTask.identifier + '_blocked');
                    processRoutine.localDebug();
                    worker.message.continueProcess(processRoutine);
                },
                () => {
                    processRoutine.log('Success returned from Method: ' + processTask.identifier + '::' + processTask.method);
                    if(workerResponse.message) {
                        worker.message.addMessage(workerResponse.message);
                    }
                    processTask.updateProcessAfterWork(control_uuid, workerResponse.context, processRoutine).subscribe(
                        null,
                        null,
                        () => {
                            processTask.workStatus = 'completed';
                            processRoutine.context.signals.push(processTask.identifier + '_complete');
                            processRoutine.localDebug();
                            worker.message.continueProcess(processRoutine);
                        }
                    );
                    // }
                }
            );
        } catch(err) {
            worker.message.addStickyMessage('Been kinda an internal error, please contact support.','danger','app');
            processRoutine.log('Error returned from Method: ' + processTask.identifier + '::' + processTask.method);
            processTask.workStatus = 'blocked';
            processRoutine.context.signals.push(processTask.identifier + '_blocked');
            processRoutine.localDebug();
            worker.message.continueProcess(processRoutine);
        }
        return true;
    }

    worker.message.addStickyMessage('Error - Invalid System Status: ' + processTask.systemStatus
        + ' - Work Status: ' + processTask.workStatus + ' for Task: ' + processTask.identifier ,'warning');

    return false;
  }
}
