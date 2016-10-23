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
        public control_uuid: string
    ) {}
}

export class ProcessTask {
    constructor(
        public identifier: string,
        public trigger: string,
        public description: string,
        public method: string,
        public params: {} = {}
    ) {}

    public processRoutineHasRequiredParams(processRoutine:ProcessRoutine): Observable<any> {
        let params = Object.keys(this.params);
        let paramCount = params.length;
        let obs = new Observable((observer:any) => {
            let paramsChecked: string[] = [];
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

    public updateProcessAfterWork(control_uuid: string, context: ProcessContext): Observable<any> {
        let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));
        let params = Object.keys(context.params);
        let paramsProcessed: string[] = [];
        let obs = new Observable((observer:any) => {
            if(params.length === 0) {
                localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));
                observer.complete();
            }
            params.forEach((param) => {
                if(processRoutine.context.params.hasOwnProperty(param)) {
                    processRoutine.context.params[param] = (<any>context.params)[param];
                    paramsProcessed.push(param);
                } else if(param) {
                    processRoutine.context.params[param] = (<any>context.params)[param];
                    paramsProcessed.push(param);
                }
                if(params.length === paramsProcessed.length) {
                    localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));
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

        if(!worker.routines.hasOwnProperty(identifier)) {
            // this.message.setFlash('Error - Initiating Process: ' + identifier + ' No Routine Found.','warning');
            return false;
        }

        let processRoutine: ProcessRoutine = (<any>worker.routines)[identifier];
        // this.message.addProcessMessage('Initiating Process: ' + processRoutine.description);
        processRoutine.control_uuid = control_uuid;
        processRoutine.context = context;
        localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));

        worker.message.processSignal(new WorkerMessage(identifier + '_init', control_uuid));

        return true;
    }
}

export class WorkerMessage {
    constructor(
        public signal: string,
        public control_uuid: string
    ) {}

  public processSignal(worker:WorkerComponent): boolean {
    let signal = this.signal;
    let control_uuid = this.control_uuid;

      // Verify the Worker has a Task
      if(!worker.tasks.hasOwnProperty(signal)) {
          return false;
      }

      // Get the processRoutine from local storage
      let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));

      // Initiate ProcessTask
      let processTask: ProcessTask = (<any>worker.tasks)[signal];

      // this.message.addProcessMessage('Initiating Task: ' + processTask.description + ' Process: '
          // + processRoutine.identifier + ' Context: ' + JSON.stringify(processRoutine.context));

      // Verify Required Process Params are in place
      let paramProcessor: Observable<any> = processTask.processRoutineHasRequiredParams(processRoutine);
      paramProcessor.subscribe(
          null,
          error => {
              // this.message.addProcessMessage('missing required params: ' + error);
              worker.message.setFlash('Error - Missing Param for Process: ' + error ,'warning');
          },
          () => {
              // this.message.addProcessMessage('required params checked.');
              let workerMethod: Observable<any> = (<any>worker)[processTask.method](
                  processRoutine.control_uuid, processRoutine.context.params);
              let workerResponse: WorkerResponse;
              let workerMessage: WorkerMessage = new WorkerMessage('',control_uuid);

              workerMethod.subscribe(
                  response => workerResponse = response,
                  error => {
                      workerMessage.signal = processTask.identifier + '_error';
                      worker.message.setFlash('Worker Error: ' + JSON.stringify(error.message),'danger');
                      worker.message.processSignal(workerMessage);
                  },
                  () => {
                      workerMessage.signal = processTask.identifier + '_complete';
                      worker.message.setFlash(workerResponse.message,'success');
                      processTask.updateProcessAfterWork(control_uuid, workerResponse.context).subscribe(
                          null,
                          null,
                          () => worker.message.processSignal(workerMessage)
                      );
                  }
              );
          }
      );

      return true;
  }

}
