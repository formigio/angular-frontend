import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { User, UserService } from '../user/index';

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
  state: string = 'registered';
  confirmForm: boolean = false;

  user: User = {
    uuid: '',
    email: '',
    password_hash: '',
    password: '',
    confirm_code: ''
  };
  errorMsg = '';

  constructor(
    public service:UserService,
    public message:MessageService
  ) { }

  ngOnInit() {
    if(this.loggedin()) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
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
    console.log(this.user);
  }

  toggleState() {
    if(this.state==='new') {
      this.state = 'registered';
    } else {
      this.state = 'new';
    }
  }

  loggedin() {
    return this.service.checkCredentials();
  }

}
