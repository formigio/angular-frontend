import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { Notification, NotificationService } from './index';

@Component({
  moduleId: module.id,
  selector: 'notification-nav',
  templateUrl: 'notification-nav.component.html',
  providers: [ NotificationService ]
})
export class NotificationNavComponent implements OnInit {

  notifications: Notification[] = [];
  show: boolean = false;

  constructor(
    protected service: NotificationService,
    protected helper: HelperService,
    public message: MessageService,
    public def: ChangeDetectorRef
  ) {
    this.service = this.helper.getServiceInstance(this.service,'NotificationService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Start Notification Fetch Process
    this.service.getUnviewedSubscription().subscribe(
      (notifications:Notification[]) => {
        this.notifications = [];
        let notes: Notification[] = [];
        notifications.forEach((note) => {
          notes.push(note);
          if(!note.viewed) {
            this.notifications.push(note);
          }
          if(notes.length === notifications.length) {
            this.def.detectChanges();
          }
        });
      }
    );
    this.message.startProcess('notification_fetch_list',{params:{viewed:false}});
  }

  getNotificationCount() {
    return this.notifications.length;
  }

  toggleNotes() {
    if(this.show) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  dismiss(note:Notification) {
    note.viewed = true;
    this.message.startProcess('notification_save',{notification:note});
    this.show = false;
  }

}
