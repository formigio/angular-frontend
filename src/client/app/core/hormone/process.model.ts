import { Observable, ReplaySubject } from 'rxjs';

export interface WorkerComponent {
    routines: {};
    tasks: {};
    message: any;
}

export class ProcessRoutine {
    public control_uuid: string = '';
    public tasks: ProcessTask[] = [];
    public context: ProcessContext;
    constructor(
        public identifier: string,
        public description: string,
        public debug: boolean = false
    ) {}

    public localDebug() {
        if(this.debug)
            localStorage.setItem('process_' + this.identifier + '_' + this.control_uuid, JSON.stringify(this.context));
    }

    public log(message: string) {
        if(this.debug)
            console.log('process_' + this.identifier + '_' + this.control_uuid + ' Log: ' + message);
    }

    public cleanup() {
        localStorage.removeItem('process_' + this.control_uuid);
    }

    public queueTasks(): Observable<any> {
        let obs = new Observable((observer:any) => {
            this.log('Process Continue: Queueing ' + this.tasks.length + 'Tasks');
            this.log('Process Continue: signals: ' + this.context.signals);

            let allTasks = this.tasks.length;
            let completedTasks = 0;
            let processedTasks = 0;

            this.tasks.forEach((task) => {
                this.log('Queue Task: ' + task.identifier);
                this.log(task.identifier + ' Ready? ' + task.ready(this.context));
                this.log(task.identifier + ' System: ' + task.systemStatus);
                this.log(task.identifier + ' Work: ' + task.workStatus);

                if(task.workStatus === 'completed' || task.workStatus === 'blocked') {
                    completedTasks += 1;
                    processedTasks += 1;
                    this.localDebug();
                    if(completedTasks === allTasks) {
                        this.log('Looks like we have processed all the tasks');
                        observer.next(this);
                        observer.complete();
                    }
                    this.log(completedTasks + ' Completed Tasks | ' + processedTasks + ' Processed Tasks');
                    return;
                }

                // Here we can do some state/status checks to see if we need to actual queue the work
                if(task.ready(this.context) && (task.systemStatus === 'pending' || task.systemStatus === 'ready')) {
                    this.log('Queueing Work for ' + task.identifier);
                    // task.queue hits the specific worker
                    task.queue.next(new WorkerMessage(task, this.control_uuid, this));
                } else {
                    processedTasks += 1;
                    if(processedTasks === allTasks) {
                        this.log('Looks like we have processed all the tasks');
                        observer.next(this);
                        observer.complete();
                    }
                }
            });
        });
        return obs;
    }

    public resetTaskStatuses(): Observable<any> {
        let tasks = this.tasks;
        let obs = new Observable((observer:any) => {
            let tasksReset: string[] = [];
            if(tasks.length === 0) {
                observer.complete();
            }
            tasks.forEach((task) => {
                task.resetStatus();
                tasksReset.push(this.identifier);
                this.log('Reseting task ' + this.identifier);
                if(tasks.length === tasksReset.length) {
                    this.log('All tasks reset for ' + this.identifier);
                    observer.complete();
                }
            });
            return;
        });

        return obs;
    }

    public initTasks(): Observable<any> {
        let tasks = this.tasks;
        let obs = new Observable((observer:any) => {
            let tasksReset: string[] = [];
            let initTasks: ProcessTask[] = [];
            if(tasks.length === 0) {
                observer.complete();
            }
            tasks.forEach((taskTemplate) => {
                let task = new ProcessTask(
                    taskTemplate.identifier,
                    taskTemplate.trigger,
                    taskTemplate.routine,
                    taskTemplate.description,
                    taskTemplate.method,
                    taskTemplate.ready,
                    taskTemplate.params
                );
                task.queue = taskTemplate.queue;
                task.resetStatus();
                tasksReset.push(task.identifier);
                this.log('Reseting task ' + task.identifier);
                initTasks.push(task);
                if(tasks.length === tasksReset.length) {
                    this.log('All tasks reset for ' + this.identifier);
                    this.tasks = initTasks;
                    observer.complete();
                }
            });
            return;
        });

        return obs;
    }

}

export class ProcessTaskRegistration {
    constructor(
        public tasks: {},
        public queue: ReplaySubject<any>
    ) {}
}

export class ProcessTask {

    public systemStatus: string = 'pending';
    public workStatus: string = 'notstarted';
    public queue: ReplaySubject<any>;

    constructor(
        public identifier: string,
        public trigger: string,
        public routine: string,
        public description: string,
        public method: string,
        public ready: Function,
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
                    processRoutine.log('All params checked for ' + this.identifier);
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
            processRoutine.log('Updating Params: ' + this.identifier + '::' + this.method);

            if(params.length === 0) {
                processRoutine.localDebug();
                observer.complete();
            }
            params.forEach((param) => {
                contextParams[param] = (<any>context.params)[param];
                paramsProcessed.push(param);
                if(params.length === paramsProcessed.length) {
                    processRoutine.log('All params updated for ' + this.identifier);
                    processRoutine.context.params = contextParams;
                    processRoutine.localDebug();
                    observer.complete();
                }

            });
        });
        return obs;
    }

    public resetStatus() {
        this.systemStatus = 'pending';
        this.workStatus = 'notstarted';
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

        let processRoutineTemplate: ProcessRoutine = (<any>worker.routines)[identifier];
        let processRoutine: ProcessRoutine = new ProcessRoutine(
          processRoutineTemplate.identifier,
          processRoutineTemplate.description,
          processRoutineTemplate.debug
        );
        processRoutine.control_uuid = control_uuid;
        processRoutine.context = context;
        processRoutine.tasks = processRoutineTemplate.tasks;

        processRoutine.log('Process Starting: ' + processRoutine.identifier);

        processRoutine.initTasks().subscribe(null,null,() => {
            processRoutine.localDebug();
            processRoutine.context.signals.push(processRoutine.identifier + '_init');
            worker.message.continueProcess(processRoutine);
        });

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
                    let errorMessage:string = '';
                    if(typeof error.message === 'string') {
                        errorMessage = error.message;
                    } else {
                        errorMessage = JSON.stringify(error.message);
                    }
                    if(errorMessage) {
                        worker.message.addStickyMessage(errorMessage,'danger');
                    }
                    processTask.workStatus = 'blocked';
                    processRoutine.context.signals.push(processTask.identifier + '_blocked');
                    processRoutine.localDebug();
                    worker.message.continueProcess(processRoutine);
                },
                () => {
                    processRoutine.log('Success returned from Method: ' + processTask.identifier + '::' + processTask.method);
                    if(workerResponse.message) {
                        worker.message.setFlash(workerResponse.message,'success');
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
            worker.message.addStickyMessage('Been kinda an internal error, please contact support.','danger');
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
