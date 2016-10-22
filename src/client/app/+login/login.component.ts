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

  user: User = {
    uuid: '',
    email: '',
    password_hash: '',
    password: ''
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
    // this.service.login(this.user)
    this.message.startProcess('user_login',{user:this.user});
  }

  logout() {
    this.service.logout();
  }

  register() {
    this.service.register(this.user);
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
