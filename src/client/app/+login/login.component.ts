import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MessageService } from '../core/index';
import { User, UserService } from '../user/index';

declare let gapi:any;

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
export class LoginComponent implements OnInit, AfterViewInit {

  states: String[] = ['new','registered'];
  state: string = 'registered';
  confirmForm: boolean = false;

  user: User = {
    uuid: '',
    email: '',
    password_hash: '',
    password: '',
    identity_provider: '',
    confirm_code: '',
    credentials: {
      accessKey:'',
      secretKey:'',
      sessionToken:''
    }
  };
  errorMsg = '';

  constructor(
    public service:UserService,
    public message:MessageService
  ) { }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    if(!localStorage.getItem('user')) {
      gapi.signin2.render(
        'g-signin2',
        {
          onSuccess: this.handleGoogleLogin,
          scope: 'email'
        }
      );
    }
  }

  ngOnInit() {
    console.log('ngOnInit');
    if(this.loggedin()) {
      this.user = JSON.parse(localStorage.getItem('user'));
    }
  }

  handleGoogleLogin = (loggedInUser:any) => {
    let profile:any = loggedInUser.getBasicProfile();
    this.message.startProcess('user_login_google',{
      navigate_to:'/',
      token:loggedInUser.getAuthResponse().id_token,
      user: new User(
        profile.getId(),
        profile.getEmail(),
        '','',
        '',
        'Google',
        {
          accessKey:'',
          secretKey:'',
          sessionToken:''
        }
      )
    });
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
