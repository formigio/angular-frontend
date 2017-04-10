import { Observable } from 'rxjs/Observable';

export interface WorkerComponent {
    routines: {};
    tasks: {};
    message: any;
}

export class ProcessRoutine {
    constructor(
        public identifier: string,
        public description: string,
        public context: ProcessContext,
        public tasks: ProcessTask[],
        public control_uuid: string,
        public debug: boolean = false
    ) {}

    public localDebug() {
        if(this.debug)
            localStorage.setItem('process_' + this.control_uuid, JSON.stringify(this));
    }

    public log(message: string) {
        console.log(message);
    }

    public cleanup() {
        localStorage.removeItem('process_' + this.control_uuid);
    }
}

export class ProcessTaskRegistration {
    constructor(
        public tasks: {}
    ) {}
}

export class ProcessTask {
    constructor(
        public identifier: string,
        public trigger: string,
        public routine: string,
        public description: string,
        public method: string,
        public params: {} = {}
    ) {}

    public processRoutineHasRequiredParams(processRoutine:ProcessRoutine): Observable<any> {
        let params = Object.keys(this.params);
        let paramCount = params.length;
        let obs = new Observable((observer:any) => {
            let paramsChecked: string[] = [];
            if(processRoutine === null) {
                observer.complete();
                return;
            }
            if(params.length === 0) {
                observer.complete();
            }
            params.forEach((param) => {
                if(processRoutine.context.params.hasOwnProperty(param)) {
                    paramsChecked.push(param);
                } else {
                    observer.error(param);
                }
                if(paramCount === paramsChecked.length) {
                    observer.complete();
                }
            });
            return;
        });

        return obs;
    }

    public updateProcessAfterWork(control_uuid: string, context: ProcessContext, routine: ProcessRoutine): Observable<any> {
        let processRoutine = routine;
        let contextParams:any = JSON.parse(JSON.stringify(processRoutine.context.params));
        let params = Object.keys(context.params);
        let paramsProcessed: string[] = [];
        let obs = new Observable((observer:any) => {
            if(params.length === 0) {
                processRoutine.localDebug();
                observer.complete();
            }
            params.forEach((param) => {
                contextParams[param] = (<any>context.params)[param];
                paramsProcessed.push(param);
                if(params.length === paramsProcessed.length) {
                    processRoutine.context.params = contextParams;
                    processRoutine.localDebug();
                    observer.complete();
                }

            });
        });
        return obs;
    }

}

export class ProcessContext {
    constructor(
        public params: {} = {}
    ) {}
}

export class WorkerResponse {
    constructor(
        public outcome: string,
        public message: string,
        public context: ProcessContext,
        public control_uuid: string
    ) {}
}

export class ProcessMessage {
    constructor(
        public routine: string,
        public params: {}
    ) {}

    public createContextParams(params:{}): ProcessContext {
        return new ProcessContext(params);
    }

    public initProcess(worker:WorkerComponent): boolean {

        let identifier = this.routine;
        let params = this.params;
        let control_uuid: string = Math.random().toString().split('.').pop().toString();

        let context = this.createContextParams(params);
        // We can potentially create a ReplaySubject here
        // Then the initiator of the process can subscribe to Process Events
        // We can then push next/error/complete to the subject, and the subscriber can react.

        if(!worker.routines.hasOwnProperty(identifier)) {
            return false;
        }

        let processRoutine: ProcessRoutine = (<any>worker.routines)[identifier];
        processRoutine.control_uuid = control_uuid;
        processRoutine.context = context;

        processRoutine.localDebug();

        worker.message.processSignal(new WorkerMessage(identifier + '_init', control_uuid, processRoutine));

        return true;
        //
    }
}

export class WorkerMessage {
    constructor(
        public signal: string,
        public control_uuid: string,
        public routine: ProcessRoutine
    ) {}

  public processSignal(worker:WorkerComponent): boolean {
    let signal = this.signal;
    let control_uuid = this.control_uuid;
    let processRoutine = this.routine;
    // console.log('Processing Signal: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);
      // Verify the Worker has a Task
      if(!worker.tasks.hasOwnProperty(signal)) {
          return false;
      }
    //   console.log('Claim Signal: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);

      if(processRoutine === null) {
          return false;
      }

      // Initiate ProcessTask
      let processTask: ProcessTask = (<any>worker.tasks)[signal];

      // Verify Required Process Params are in place
      let paramProcessor: Observable<any> = processTask.processRoutineHasRequiredParams(processRoutine);
      paramProcessor.subscribe(
          null,
          error => {
              // this.message.addProcessMessage('missing required params: ' + error);
              worker.message.setFlash('Error - Missing Param for Process: ' + error ,'warning');
          },
          () => {
            //   console.log('Working Signal: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);
              let workerMethod: Observable<any> = (<any>worker)[processTask.method](
                  processRoutine.control_uuid, processRoutine.context.params);
              let workerResponse: WorkerResponse;
              let workerMessage: WorkerMessage = new WorkerMessage('',control_uuid,processRoutine);

              workerMethod.subscribe(
                  response => workerResponse = response,
                  error => {
                    //   console.log('Error: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);
                      workerMessage.signal = processTask.identifier + '_error';
                      let errorMessage:string = '';
                      if(typeof error.message === 'string') {
                        errorMessage = error.message;
                      } else {
                        errorMessage = JSON.stringify(error.message);
                      }
                      if(errorMessage) {
                        worker.message.addStickyMessage(errorMessage,'danger');
                      }
                      worker.message.processSignal(workerMessage);
                  },
                  () => {
                    //   console.log('Complete: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);
                      if(workerResponse.outcome === 'end') {
                        processRoutine.cleanup();
                      } else {
                        workerMessage.signal = processTask.identifier + '_complete';
                        if(workerResponse.message) {
                            worker.message.setFlash(workerResponse.message,'success');
                        }
                        processTask.updateProcessAfterWork(control_uuid, workerResponse.context, processRoutine).subscribe(
                            null,
                            null,
                            () => worker.message.processSignal(workerMessage)
                        );
                      }
                  }
              );
          }
      );

      return true;
  }

}
