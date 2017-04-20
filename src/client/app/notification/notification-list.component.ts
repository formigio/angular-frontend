import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, Notification, NotificationItemComponent } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'notification-list',
  directives: [ NotificationItemComponent ],
  templateUrl: 'notification-list.component.html',
  providers: [ NotificationService ]
})

export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];

  loading:boolean = false;

  constructor(
    public service: NotificationService,
    public message: MessageService,
    public helper: HelperService,
    public router: Router
  ) {
    this.service = this.helper.getServiceInstance(this.service,'NotificationService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      notifications => {
        this.loading = false;
        this.notifications = notifications;
      }
    );
    this.refreshNotifications();
  }

  refreshNotifications() {
    this.loading = true;
    this.message.startProcess('notification_fetch_list',{params:{}});
  }

}
