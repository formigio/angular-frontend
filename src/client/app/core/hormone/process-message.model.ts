import { ProcessRoutine, ProcessContext, WorkerComponent } from '../index';

export class ProcessMessage {
    constructor(
        public routine: string,
        public params: {}
    ) {}

    public createContextParams(params:{}): ProcessContext {
        return new ProcessContext(params);
    }

    public initProcess(worker:WorkerComponent): ProcessRoutine {
        let identifier = this.routine;
        let params = this.params;
        let control_uuid: string = Math.random().toString().split('.').pop().toString();
        let context = this.createContextParams(params);
        let processRoutineTemplate: ProcessRoutine = (<any>worker.routines)[identifier];
        let processRoutine: ProcessRoutine = new ProcessRoutine(
          processRoutineTemplate.identifier,
          processRoutineTemplate.description,
          processRoutineTemplate.ready,
          processRoutineTemplate.debug
        );

        processRoutine.control_uuid = control_uuid;
        processRoutine.context = context;
        processRoutine.worker = worker;
        processRoutine.tasks = processRoutineTemplate.tasks;

        return processRoutine;
    }
}
