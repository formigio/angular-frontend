import { Injectable } from '@angular/core';
import { ReplaySubject, Observable } from 'rxjs';

export class FlashMessage {
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

    public setFlash(message:string, alert:string = 'info') {
        let flashMessage = new FlashMessage(true,message,alert);
        this.flashMessage.next(flashMessage);
        var control = Observable.timer(3000);
        control.subscribe(x => flashMessage.show = false);
    }

    public getFlashMessage(): ReplaySubject<any> {
        return this.flashMessage;
    }

}
