import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ProcessMessage, ProcessTaskRegistration, ProcessRoutine } from '../index';

export class Message {
  constructor(
    public show: boolean = false,
    public message: string = '',
    public alert: string = 'info'
  ) {}
}

export class SocketMessage {
  constructor(
    public process: string = '',
    public params: {} = {},
    public notify: string[] = []
  ) {}
}

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class MessageService {

    socketSubject: Subject<any>;

    public flashMessage: ReplaySubject<any> = new ReplaySubject();
    public processMessage: ReplaySubject<any> = new ReplaySubject();
    public stickyMessage: ReplaySubject<any> = new ReplaySubject();
    public workerQueue: ReplaySubject<any> = new ReplaySubject();
    public processInitQueue: ReplaySubject<any> = new ReplaySubject();
    public processQueue: ReplaySubject<any> = new ReplaySubject();
    public registrarQueue: ReplaySubject<any> = new ReplaySubject();

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

    public getProcessQueue(): ReplaySubject<any> {
        return this.processQueue;
    }

    public getProcessInitQueue(): ReplaySubject<any> {
        return this.processInitQueue;
    }

    public getRegistrarQueue(): ReplaySubject<any> {
        return this.registrarQueue;
    }

    public registerProcessTasks(processTaskRegistration: ProcessTaskRegistration) {
        this.registrarQueue.next(processTaskRegistration);
    }

    public sendSocketMessage(message:SocketMessage) {
        this.socketSubject.next(message);
    }

    public connectToSocket(url:string) {
        this.wsconnect(url).subscribe(
            response => {
                let message:SocketMessage = JSON.parse(response.data);
                this.startProcess(message.process,message.params);
                this.setFlash('Process: ' + message.process + ' requested.');
            },
            error => {console.log(error);},
            () => {
                this.addStickyMessage('We may have lost connection with the Notification Service...');
            }
        );
    }

    public wsconnect(url:string): Subject<any> {
        if(!this.socketSubject) {
            this.socketSubject = this.wscreate(url);
        }

        return this.socketSubject;
    }

    private wscreate(url:string): Subject<any> {
        let ws = new WebSocket(url);
        let obs = new Observable((observer:any) => {
            ws.onmessage = observer.next.bind(observer);
            ws.onerror = observer.error.bind(observer);
            ws.onclose = observer.complete.bind(observer);
            return ws.close.bind(ws);
        });

        let observer = {
            error: () => {
                // error handler
            },
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
            complete: () => {
                // complete handler
            }
        };

        return new Subject(observer,obs);
    }

}
