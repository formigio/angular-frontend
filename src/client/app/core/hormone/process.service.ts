import { Injectable } from '@angular/core';
import { TaskService } from '../../task/index';
import { MessageService } from '../../shared/index';

export class ProcessTask {
    constructor(
        public identifier: string,
        public trigger: string,
        public description: string,
        public worker_service: any,
        public method: any
    ) {}
}

export class ProcessRoutine {
    constructor(
        public identifier: string,
        public description: string,
        public context: {},
        public control_uuid: string
    ) {}
}

@Injectable()
export class ProcessService {

    protected routines: {} = {
        goal_delete: new ProcessRoutine(
            'goal_delete',
            'The Process Used to Control the Deletion of Goals',
            {},
            ''
        )
    };

    protected tasks: {} = {
        goal_delete_init: new ProcessTask(
            'gather_goal_tasks',
            'goal_delete_init',
            'Gather Goal Tasks',
            TaskService,
            'workerTaskGatherGoals'
        )
    };

    public constructor(private message: MessageService) {}

    public initProcess(identifier: string): boolean {
        let control_uuid: string = Math.random().toString().split('.').pop().toString();

        if(!this.routines.hasOwnProperty(identifier)) {
            this.message.setFlash('Error - Initiating Process:' + identifier + ' No Routine Found.','warning');
            return false;
        }

        let processRoutine: ProcessRoutine = (<any>this.routines)[identifier];
        this.message.addProcessMessage('Initiating Process:' + processRoutine.description);
        processRoutine.control_uuid = control_uuid;
        localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));

        this.processSignal(identifier + '_init', control_uuid);

        return true;
    }

    public processSignal(signal: string, control_uuid: string): boolean {
        // Get the processRoutine from local storage
        let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));

        if(!this.tasks.hasOwnProperty(signal)) {
            this.message.setFlash('Error - Initiating Task for Signal:' + signal + ' No Task Found.','warning');
            return false;
        }

        let processTask: ProcessTask = (<any>this.tasks)[signal];

        this.message.addProcessMessage('Initiating Task:' + processTask.description + ' Process: ' + processRoutine.identifier);

        return true;

    }

}
