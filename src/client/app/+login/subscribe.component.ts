import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { User, UserService } from '../user/index';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'subscribe-form',
  templateUrl: 'subscribe.component.html',
  styleUrls: [],
  providers: [ UserService ]
})
export class SubscribeComponent implements OnInit {

  user: User;
  existing: User;
  validEmail: boolean = false;

  constructor(
    public service:UserService,
    public message:MessageService,
    public helper:HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'UserService');
  }

  ngOnInit() {
    this.service.enforceAuthentication();
    this.user = this.service.retrieveUser();
    this.existing = this.user;
    this.service.getItemSubscription().subscribe(
      user => {
        this.user = user;
        this.existing = JSON.parse(JSON.stringify(user));
        this.testEmail();
      }
    );
  }

  save() {
    this.message.startProcess('user_update',{user:this.user});
  }

  isValidEmail():boolean {
    if(!this.user.worker.subscription.email) {
      return false;
    }
    return this.user.worker.subscription.email
      .match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b/gi) !== null;
  }

  testEmail() {
    this.validEmail = this.isValidEmail();
    console.log(this.user.worker.subscription.email);
    console.log('Valid: ' + this.validEmail);
  }

}
