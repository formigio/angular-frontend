import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

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

    public flashMessage: ReplaySubject<any> = new ReplaySubject(1);
    public processMessage: ReplaySubject<any> = new ReplaySubject(1);

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

    public getFlashMessage(): ReplaySubject<any> {
        return this.flashMessage;
    }

    public getProcessMessageRelay(): ReplaySubject<any> {
        return this.processMessage;
    }


}
