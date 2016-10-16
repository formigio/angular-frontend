import { Observable } from 'rxjs/Observable';

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
        public method: string,
        public params: {} = {}
    ) {}

    public processRoutineHasRequiredParams(processRoutine:ProcessRoutine): Observable<any> {
        let params = Object.keys(this.params);
        let paramCount = params.length;
        let obs = new Observable((observer:any) => {
            let paramsChecked: string[] = [];
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
            return;
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
