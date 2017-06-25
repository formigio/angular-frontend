import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ProcessMessage, ProcessTaskRegistration, ProcessRoutine } from '../index';

export class Message {
  constructor(
    public message: string = '',
    public alert: string = 'info',
    public queue: string = 'flash',
    public channel: string = '',
    public show: boolean = true
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

    pendingProcesses: {} = {};

    public messageQueue: ReplaySubject<any> = new ReplaySubject();
    public workerQueue: ReplaySubject<any> = new ReplaySubject();
    public processInitQueue: ReplaySubject<any> = new ReplaySubject();
    public processQueue: ReplaySubject<any> = new ReplaySubject();
    public registrarQueue: ReplaySubject<any> = new ReplaySubject();

    public setFlash(message:string, alert:string = 'info') {
        let flashMessage = new Message(message,alert,'flash');
        this.messageQueue.next(flashMessage);
        var control = Observable.timer(3000);
        control.subscribe(x => flashMessage.show = false);
    }

    public addProcessMessage(message:string, alert:string = 'info', channel = '', queue = 'process') {
        let processMessage = new Message(message,alert,'process',channel);
        this.messageQueue.next(processMessage);
        var control = Observable.timer(3000);
        control.subscribe(x => processMessage.show = false);
    }

    public addStickyMessage(message:string, alert:string = 'info', channel:string = '', queue = 'sticky') {
        let stickyMessage = new Message(message,alert,'sticky',channel);
        this.messageQueue.next(stickyMessage);
    }

    public addMessage(message:Message) {
        switch(message.queue) {
            case 'sticky':
                this.addStickyMessage(message.message,message.alert,message.channel,message.queue);
                break;
            case 'process':
                this.addProcessMessage(message.message,message.alert,message.channel,message.queue);
                break;
            default:
                this.setFlash(message.message,message.alert);
                break;
        }
    }

    public startProcess(routine: string, params: {}) {
        this.processInitQueue.next(new ProcessMessage(routine,params));
    }

    public continueProcess(process: ProcessRoutine) {
        this.processQueue.next(process);
    }

    public addPendingProcess(process: ProcessRoutine) {
        (<any>this.pendingProcesses)[process.identifier] = process;
    }

    public processPendingProcesses() {
        let pendings: string[] = Object.keys(this.pendingProcesses);
        pendings.forEach((identifier:string) => {
            let process:ProcessRoutine = (<any>this.pendingProcesses)[identifier];
            delete (<any>this.pendingProcesses)[identifier];
            if(typeof process !== 'undefined')
                process.start();
        });
    }

    public gethMessageQueue(): ReplaySubject<any> {
        return this.messageQueue;
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
                this.addProcessMessage('We may have lost connection with the Notification Service...','warning');
                this.startProcess('notification_connect',{url:url});
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
