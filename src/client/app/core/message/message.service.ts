import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { WorkerMessage, ProcessMessage } from '../index';

export class Message {
  constructor(
    public show: boolean = false,
    public message: string = '',
    public alert: string = 'info'
  ) {}
}

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class MessageService {

// Add Notices, messages that must be dismissed. Notices stack.

    public flashMessage: ReplaySubject<any> = new ReplaySubject(1);
    public processMessage: ReplaySubject<any> = new ReplaySubject(1);
    public workerQueue: ReplaySubject<any> = new ReplaySubject(1);
    public processQueue: ReplaySubject<any> = new ReplaySubject(1);

    public setFlash(message:string, alert:string = 'info') {
        let flashMessage = new Message(true,message,alert);
        this.flashMessage.next(flashMessage);
        var control = Observable.timer(3000);
        control.subscribe(x => flashMessage.show = false);
    }

    public addProcessMessage(message:string, alert:string = 'info') {
        let processMessage = new Message(true,message,alert);
        this.processMessage.next(processMessage);
        var control = Observable.timer(3000);
        control.subscribe(x => processMessage.show = false);
    }

    public processSignal(message: WorkerMessage) {
        this.workerQueue.next(message);
    }

    public startProcess(routine: string, params: {}) {
        this.processQueue.next(new ProcessMessage(routine,params));
    }

    public getFlashMessage(): ReplaySubject<any> {
        return this.flashMessage;
    }

    public getProcessMessageRelay(): ReplaySubject<any> {
        return this.processMessage;
    }

    public getWorkerQueue(): ReplaySubject<any> {
        return this.workerQueue;
    }

    public getProcessQueue(): ReplaySubject<any> {
        return this.processQueue;
    }

}
