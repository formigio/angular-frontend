import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { WorkerMessage, ProcessMessage, ProcessTaskRegistration, ProcessTask, ProcessRoutine } from '../index';

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
    public stickyMessage: ReplaySubject<any> = new ReplaySubject(1);
    public workerQueue: ReplaySubject<any> = new ReplaySubject(1);
    public processInitQueue: ReplaySubject<any> = new ReplaySubject(1);
    public processQueue: ReplaySubject<any> = new ReplaySubject(1);
    public registrarQueue: ReplaySubject<any> = new ReplaySubject(1);

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

    public addStickyMessage(message:string, alert:string = 'info') {
        let stickyMessage = new Message(true,message,alert);
        this.stickyMessage.next(stickyMessage);
    }

    public processSignal(message: WorkerMessage) {
        let date = new Date();
        this.workerQueue.next(message);
    }

    public startProcess(routine: string, params: {}) {
        this.processInitQueue.next(new ProcessMessage(routine,params));
    }

    public continueProcess(process: ProcessRoutine) {
        this.processQueue.next(process);
    }

    public getFlashMessage(): ReplaySubject<any> {
        return this.flashMessage;
    }

    public getStickyMessageRelay(): ReplaySubject<any> {
        return this.stickyMessage;
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

    public getProcessInitQueue(): ReplaySubject<any> {
        return this.processInitQueue;
    }

    public getRegistrarQueue(): ReplaySubject<any> {
        return this.registrarQueue;
    }

    public registerProcessTasks(tasks: any) {
        this.registrarQueue.next(new ProcessTaskRegistration(tasks));
    }

}
