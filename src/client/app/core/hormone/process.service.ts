import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable'
import { TaskService } from '../../task/index';
import { GoalService } from '../../goal/index';
import { HelperService } from '../../shared/index';
import { MessageService } from '../../shared/index';

export class ProcessWorkerService {
    constructor(
        public service: any,
        public alias: string,
        public method: string
    ) {}
}

export class ProcessTask {
    constructor(
        public identifier: string,
        public trigger: string,
        public description: string,
        public workerService: ProcessWorkerService,
        public params: {} = {}
    ) {}

    public processRoutineHasRequiredParams(processRoutine:ProcessRoutine): Observable<any> {
        let params = Object.keys(this.params);
        let paramCount = params.length;
        let obs = new Observable((observer:any) => {
            let paramsChecked: string[] = [];
            params.forEach((param) => {
                if(processRoutine.context.params.hasOwnProperty(param)){
                    console.log('Checked Param: ' + param);
                    paramsChecked.push(param);
                } else {
                    console.log('Missing Param: ' + param);
                    observer.error(param);
                }
                if(paramCount === paramsChecked.length) {
                    console.log('Param Counts: ' + paramCount + ' Checked: ' + paramsChecked.length);
                    observer.complete();
                }
            });
            return () => console.log('Observer Created for Param Checking.')
        });

        return obs;
    }

    public updateProcessAfterWork(control_uuid: string, context: ProcessContext): Observable<any> {
        let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));
        let params = Object.keys(context.params);
        let paramsProcessed: string[] = [];
        let obs = new Observable((observer:any) => {
            if(params.length == 0) {
                console.log('Param Counts: ' + params.length + ' Checked: ' + paramsProcessed.length);
                localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));
                observer.complete();
            }
            params.forEach((param) => {
                if(processRoutine.context.params.hasOwnProperty(param)){
                    console.log('Updated Existing Param: ' + param);
                    processRoutine.context.params[param] = (<any>context.params)[param];
                    paramsProcessed.push(param);
                } else if(param) {
                    console.log('Added New Param: ' + param);
                    processRoutine.context.params[param] = (<any>context.params)[param];
                    paramsProcessed.push(param);
                }
                if(params.length === paramsProcessed.length) {
                    console.log('Param Counts: ' + params.length + ' Checked: ' + paramsProcessed.length);
                    localStorage.setItem('process_' + control_uuid, JSON.stringify(processRoutine));
                    observer.complete();
                }

            });
            return () => console.log('Observer Created for Param Checking.')
        });
        return obs;
    }

}

export class ProcessContext {
    constructor(
        public params: {} = {}
    ) {}
}

export class ProcessRoutine {
    constructor(
        public identifier: string,
        public description: string,
        public context: ProcessContext,
        public control_uuid: string
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

@Injectable()
export class ProcessService {

    protected routines: {} = {
        goal_delete: new ProcessRoutine(
            'goal_delete',
            'The Process Used to Control the Deletion of Goals',
            new ProcessContext,
            ''
        ),
        task_delete: new ProcessRoutine(
            'task_delete',
            'The Process Used to Control the Deletion of Tasks',
            new ProcessContext,
            ''
        )
    };

    protected tasks: {} = {
        task_delete_init: new ProcessTask(
            'delete_task',
            'goal_delete_init',
            'Delete Task',
            new ProcessWorkerService(TaskService, 'taskService', 'deleteTask'),
            {task:"Task"}
        ),
        goal_delete_init: new ProcessTask(
            'gather_goal_tasks',
            'goal_delete_init',
            'Gather Goal Tasks',
            new ProcessWorkerService(TaskService, 'taskService', 'workerTaskGatherTasks'),
            {goal:"string"}
        ),
        gather_goal_tasks_complete: new ProcessTask(
            'remove_tasks',
            'gather_goal_tasks_complete',
            'Remove Tasks for a specific goal',
            new ProcessWorkerService(TaskService, 'taskService', 'workerTaskRemoveTasks'),
            {goal:"string", task_count:"string"}
        ),
        remove_tasks_complete: new ProcessTask(
            'remove_goal',
            'remove_tasks_complete',
            'Delete Goal',
            new ProcessWorkerService(GoalService, "goalService", 'removeGoal'),
            {goal:"string", task_count:"string"}
        ),
        remove_goal_complete: new ProcessTask(
            'navigate_to_goals',
            'remove_tasks_complete',
            'Navigate Goal',
            new ProcessWorkerService(HelperService, "helperService", 'navigateTo'),
            {navigate_to:"string"}
        )
    };

    public constructor(
        private message: MessageService,
        private taskService: TaskService,
        private goalService: GoalService,
        private helperService: HelperService
    ) {}

    public createContextParams(params:{}): ProcessContext {
        return new ProcessContext(params);
    }

    public initProcess(identifier: string, params: {}): boolean {
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

        this.processSignal(identifier + '_init', control_uuid);

        return true;
    }

    public processSignal(signal: string, control_uuid: string): boolean {
        console.log('Process Signal: ' + signal);
        // Get the processRoutine from local storage
        let processRoutine = JSON.parse(localStorage.getItem('process_' + control_uuid));

        // Verify the Task
        if(!this.tasks.hasOwnProperty(signal)) {
            this.message.addProcessMessage('Warning - Initiating Task for Signal: ' + signal + ' No Task Found.','warning');
            // localStorage.removeItem('process_' + control_uuid);
            return false;
        }

        // Initiate ProcessTask
        let processTask: ProcessTask = (<any>this.tasks)[signal];

        this.message.addProcessMessage('Initiating Task: ' + processTask.description + ' Process: '
            + processRoutine.identifier + ' Context: ' + JSON.stringify(processRoutine.context));

        // Verify Required Process Params are in place
        processTask.processRoutineHasRequiredParams(processRoutine).subscribe(
            result => console.log('Subscribe Result' + result),
            error => {
                this.message.addProcessMessage('missing required params: ' + error);
            },
            () => {
                this.message.addProcessMessage('required params checked.');
                let workerAlias = processTask.workerService.alias;
                let workerService = (<any>this)[workerAlias].getWorker();
                let workerMethod = processTask.workerService.method;
                let workerResponse: WorkerResponse;
                let workerObserver: Observable<any> = workerService[workerMethod](processRoutine.control_uuid, processRoutine.context.params);
                workerObserver.subscribe(
                    response => workerResponse = response,
                    workerError => {
                        this.message.addProcessMessage('Worker Error: ' + JSON.stringify(workerError.message))
                        this.processSignal(processTask.identifier + '_error', control_uuid)
                    },
                    () => {
                        this.message.addProcessMessage('Worker Response: ' + JSON.stringify(workerResponse.message));
                        processTask.updateProcessAfterWork(control_uuid, workerResponse.context).subscribe(
                            null,
                            null,
                            () => this.processSignal(processTask.identifier + '_complete', control_uuid)
                        );
                    }
                );
            }
        );

        return true;
    }
}
