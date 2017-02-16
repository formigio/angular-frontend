import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { User, UserService } from '../user/index';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'registration-form',
  templateUrl: 'register.component.html',
  styleUrls: [],
  providers: [ UserService ]
})
export class RegisterComponent implements OnInit {

  user: User;
  validUsername: boolean = false;
  usernameTested: boolean = false;

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
    this.service.getUsernameSubscription().subscribe(
      usernameValid => {
        this.usernameTested = true;
        this.validUsername = usernameValid;
      }
    );
    this.service.getItemSubscription().subscribe(
      user => this.user = user
    );
  }

  save() {
    this.message.startProcess('user_update',{user:this.user});
  }

  testUsername() {
    if(this.user.worker.username) {
      this.usernameTested = false;
      this.message.startProcess('user_test_username',{user:this.user});
    }
  }

  clearTested() {
    this.usernameTested = false;
  }

}
