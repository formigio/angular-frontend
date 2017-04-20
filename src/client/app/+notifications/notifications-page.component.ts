import { Component, OnInit } from '@angular/core';
import { NotificationListComponent } from '../notification/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'notifications-page',
  directives: [ NotificationListComponent ],
  templateUrl: 'notifications-page.component.html'
})

export class NotificationsPageComponent implements OnInit {

  constructor(
    public auth: UserService
  ) {}

  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
