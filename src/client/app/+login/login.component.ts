import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { User, UserStruct, UserService } from '../user/index';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [ UserService ]
})
export class LoginComponent implements OnInit {

  states: String[] = ['new','registered'];
  providers: String[] = ['google','cognito'];
  state: string = 'registered';
  provider: string = '';
  confirmForm: boolean = false;

  user: User = UserStruct;
  errorMsg = '';

  constructor(
    public service:UserService,
    public message:MessageService,
    public helper:HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'UserService');
  }

  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      user => this.user = user
    );
  }

  login() {
    this.message.startProcess('user_login',{user:this.user});
  }

  logout() {
    this.service.logout();
  }

  register() {
    this.message.startProcess('user_register',{user:this.user});
    this.confirmForm = true;
  }

  confirm() {
    this.message.startProcess('user_confirm',{user:this.user});
  }

  toggleState() {
    if(this.state==='new') {
      this.state = 'registered';
    } else {
      this.state = 'new';
    }
    this.confirmForm = false;
  }

  loggedin(): boolean {
    return this.service.checkCredentials();
  }

  setProvider(provider:string) {
    this.provider = provider;
  }

}
