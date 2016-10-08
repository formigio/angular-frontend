import { Component, OnInit } from '@angular/core';
import { MessageService, Message } from './message.service';

/**
 * This class represents the toolbar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-message',
  templateUrl: 'message.component.html',
  styleUrls: ['message.component.css']
})
export class MessageComponent implements OnInit {

    public flashMessage: Message = {show: false, message: '', alert: 'info'};
    public processMessages: Message[] = [];
    public errorMessage: any;

    constructor(protected service: MessageService) {}

    public ngOnInit() {
        this.service.getFlashMessage().subscribe(
            res => this.flashMessage = res
        );
        this.service.getProcessMessageRelay().subscribe(
            message => this.processMessages.push(message)
        );
    }

}
