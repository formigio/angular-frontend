import { Observable } from 'rxjs';
import { ProcessContext, ProcessTask, WorkerComponent, WorkerMessage } from '../index';

export class ProcessRoutine {
    public control_uuid: string = '';
    public tasks: ProcessTask[] = [];
    public context: ProcessContext;
    public worker: WorkerComponent;
    constructor(
        public identifier: string,
        public description: string,
        public debug: boolean = false
    ) {}

    public start() {
        // We can potentially create a ReplaySubject here
        // Then the initiator of the process can subscribe to Process Events
        // We can then push next/error/complete to the subject, and the subscriber can react.
        this.log('Process Starting: ' + this.identifier);

        this.initTasks().subscribe(null,null,() => {
            this.localDebug();
            this.context.signals.push(this.identifier + '_init');
            this.worker.message.continueProcess(this);
        });
    }

    // Starts the Task Evaluation
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

    // Continues the Task Evaluation
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

}