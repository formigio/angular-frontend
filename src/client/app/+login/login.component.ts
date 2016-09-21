import { Component, OnInit } from '@angular/core';
import { User, AuthenticationService } from './login.service';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'login-form',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
  providers: [ AuthenticationService ]
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
    public auth:AuthenticationService
    ) { }

  ngOnInit() {
    if(this.loggedin()) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  login() {
    if(!this.auth.login(this.user)) {
      // this.errorMsg = 'Failed to Login';
    }
  }

  logout() {
    this.auth.logout();
  }

  register() {
    this.auth.register(this.user);
  }

  toggleState() {
    if(this.state==='new') {
      this.state = 'registered';
    } else {
      this.state = 'new';
    }
  }

  loggedin() {
    return this.auth.checkCredentials();
  }

}
