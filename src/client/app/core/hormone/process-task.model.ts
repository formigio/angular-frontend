import { Observable, ReplaySubject } from 'rxjs';
import { ProcessRoutine, ProcessContext } from '../index';

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

