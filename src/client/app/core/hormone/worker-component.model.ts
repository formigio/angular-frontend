import { ReplaySubject } from 'rxjs';
import { MessageService, ProcessTask, ProcessTaskRegistration } from '../index';

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
