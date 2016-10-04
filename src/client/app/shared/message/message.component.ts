import { Component, OnInit } from '@angular/core';
import { MessageService, FlashMessage } from './message.service';

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

    public flashMessage: FlashMessage = {show: false, message: '', alert: 'info'};
    public errorMessage: any;

    constructor(protected service: MessageService) {}

    public ngOnInit() {
        this.service.getFlashMessage().subscribe(
            res => this.flashMessage = res
        );
    }

}
