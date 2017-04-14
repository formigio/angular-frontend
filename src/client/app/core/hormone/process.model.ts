import { Observable, ReplaySubject } from 'rxjs';

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

    public queueTasks() {
        this.tasks.forEach((task) => {
            // Here we can do some state/status checks to see if we need to actual queue the work
            if(task.ready(this.context) && task.systemStatus === 'pending') {
                // task.queue hits the specific worker
                task.queue.next(new WorkerMessage(task, this.control_uuid, this));
            }
        });
    }

}

export class ProcessTaskRegistration {
    constructor(
        public tasks: {}
    ) {}
}

export class ProcessTaskDef {
    constructor(
        public identifier: string,
        public trigger: string,
        public routine: string,
        public description: string,
        public method: string,
        public ready: Function,
        public params: {} = {}
    ) {}
}

export const ProcessTaskStruct = {
    identifier:'',
    trigger:'',
    routine:'',
    description:'',
    method:'',
    params:''
};

export class ProcessTask {
    constructor(
        public identifier: string,
        public trigger: string,
        public routine: string,
        public description: string,
        public method: string,
        public queue: ReplaySubject<any>,
        public ready: Function,
        public systemStatus: string = 'pending',
        public workStatus: string = 'notstarted',
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
        public params: {} = {},
        public signals: string[] = []
    ) {}

    public hasSignal(signalStr: string) {
        return this.signals.indexOf(signalStr) !== -1;
    }
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

        // processRoutine.queueTasks();
        processRoutine.context.signals.push(processRoutine.identifier + '_init');
        worker.message.continueProcess(processRoutine);
        //worker.message.processSignal(new WorkerMessage(identifier + '_init', control_uuid, processRoutine));

        return true;
        //
    }
}

export class WorkerMessage {
    constructor(
        public task: ProcessTask,
        public control_uuid: string,
        public routine: ProcessRoutine
    ) {}

  public executeMethod(worker:WorkerComponent): boolean {
    let control_uuid = this.control_uuid;
    let processRoutine = this.routine;
    if(processRoutine === null) {
        return false;
    }
    // console.log('Processing Signal: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);
      // Verify the Worker has a Task
    //   if(!worker.tasks.hasOwnProperty(signal)) {
    //       return false;
    //   }
    //   console.log('Claim Signal: ' + worker.constructor.name + ' > ' + signal + ':' + control_uuid);


    // Initiate ProcessTask
    let processTask: ProcessTask = this.task;

    if(processTask.systemStatus === 'pending' && this.task.workStatus != 'blocked') {
      // Verify Required Process Params are in place
      let paramProcessor: Observable<any> = processTask.processRoutineHasRequiredParams(processRoutine);
      paramProcessor.subscribe(
          null,
          error => {
              worker.message.addStickyMessage('Error - Missing Param for Process: ' + error ,'warning');
              this.task.workStatus = 'blocked';
              processRoutine.context.signals.push(this.task.identifier + '_error');
              worker.message.continueProcess(processRoutine);
          },
          () => {
              this.task.systemStatus = 'ready';
              processRoutine.context.signals.push(this.task.identifier + '_ready');
              worker.message.continueProcess(processRoutine);
          }
      );
      return true;
    }

    if(processTask.systemStatus === 'ready') {
        let workerMethod: Observable<any> = (<any>worker)[processTask.method](
            processRoutine.control_uuid, processRoutine.context.params);
        let workerResponse: WorkerResponse;

        workerMethod.subscribe(
            response => workerResponse = response,
            error => {
                let errorMessage:string = '';
                if(typeof error.message === 'string') {
                    errorMessage = error.message;
                } else {
                    errorMessage = JSON.stringify(error.message);
                }
                if(errorMessage) {
                    worker.message.addStickyMessage(errorMessage,'danger');
                }
                this.task.workStatus = 'blocked';
                processRoutine.context.signals.push(this.task.identifier + '_blocked');
                worker.message.continueProcess(processRoutine);
            },
            () => {
                if(workerResponse.message) {
                    worker.message.setFlash(workerResponse.message,'success');
                }
                processTask.updateProcessAfterWork(control_uuid, workerResponse.context, processRoutine).subscribe(
                    null,
                    null,
                    () => {
                        this.task.workStatus = 'completed';
                        processRoutine.context.signals.push(this.task.identifier + '_complete');
                        worker.message.continueProcess(processRoutine);
                    }
                );
                // }
            }
        );

    }

    worker.message.addStickyMessage('Error - Invalid System Status for Task: ' + processTask.identifier ,'warning');

    return true;
  }

}
