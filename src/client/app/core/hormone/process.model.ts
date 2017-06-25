import { ReplaySubject } from 'rxjs';
import { Message } from '../index';

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
