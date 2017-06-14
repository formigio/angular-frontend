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
  canShowForm: boolean = true;

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
        if(this.user.worker.subscription.email) {
          this.canShowForm = false;
        }
        this.existing = JSON.parse(JSON.stringify(user));
        this.testEmail();
      }
    );
  }

  save() {
    this.message.startProcess('user_update',{user:this.user});
    this.canShowForm = false;
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
  }

  useUserEmail() {
    this.user.worker.subscription.email = this.user.email;
    this.testEmail();
  }

  showForm() {
    this.canShowForm = true
  }

}
