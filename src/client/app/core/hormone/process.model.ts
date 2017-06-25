import { Observable, ReplaySubject } from 'rxjs';
import { Message, MessageService, ProcessRoutine, ProcessTask } from '../index';

export class WorkerBaseComponent implements WorkerComponent {

    message: MessageService;
    routines: {};
    tasks: {};

    public workQueue: ReplaySubject<any> = new ReplaySubject();

    constructor(){}

    public subscribe() {
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
                    if(this.routines.hasOwnProperty(message.routine)) {
                        // Process Inits
                        let process = message.initProcess(this);
                        process.start();

                    }
                }
            );
        }

    }
}

export interface WorkerComponent {
    routines: {};
    tasks: {};
    message: any;
}

export class ProcessTaskRegistration {
    constructor(
        public tasks: {},
        public queue: ReplaySubject<any>
    ) {}
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
        public message: Message,
        public context: ProcessContext,
        public control_uuid: string
    ) {}
}
