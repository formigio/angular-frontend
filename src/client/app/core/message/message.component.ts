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

    public flashMessage: Message = {show: false, message: '', alert: 'info', channel: '', queue: 'flash'};
    public processMessages: Message[] = [];
    public stickyMessages: Message[] = [];

    constructor(protected service: MessageService) {}

    public ngOnInit() {
        // this.service.getFlashMessage().subscribe(
        //     res => this.flashMessage = res
        // );
        // this.service.getProcessMessageRelay().subscribe(
        //     message => this.processMessages.push(message)
        // );
        this.service.gethMessageQueue().subscribe(
            message => {
                if(message.alert === 'success' || message.alert === 'info') {
                    this.stickyMessages.forEach((stickyMessage) => {
                        if(stickyMessage.channel === message.channel && stickyMessage.alert === 'danger') {
                            stickyMessage.show = false;
                        }
                    });
                }
                switch(message.queue) {
                    case 'sticky':
                        this.stickyMessages.push(message);
                        break;
                    case 'process':
                        this.processMessages.push(message);
                        break;
                    default:
                        this.flashMessage = message;
                        break;
                }
            }
        );
    }

    dismiss(message:Message) {
        message.show = false;
    }
}
