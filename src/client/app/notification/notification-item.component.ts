import { Component, Input } from '@angular/core';
import { NotificationService, Notification } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'notification-item',
  directives: [ ],
  templateUrl: 'notification-item.component.html',
  providers: [ NotificationService ]
})

export class NotificationItemComponent {

  @Input() notification: Notification;

  constructor(
    public service: NotificationService,
    public message: MessageService,
    public helper: HelperService
  ) {}

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTeam(notification:Notification) {
    this.message.startProcess('notification_delete',{notification:notification});
    return false;
  }

}
