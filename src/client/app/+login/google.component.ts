import { Component, AfterViewInit } from '@angular/core';
import { MessageService } from '../core/index';
import { User } from '../user/index';

declare let gapi:any;

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'google',
  templateUrl: 'google.component.html'
})
export class GoogleComponent implements AfterViewInit {

  constructor(
    public message:MessageService
  ) { }

  ngAfterViewInit() {
    this.renderGoogleLoginButton();
  }

  handleGoogleLogin = (loggedInUser:any) => {
    let profile:any = loggedInUser.getBasicProfile();
    let loginToken:string = loggedInUser.getAuthResponse().id_token;
    this.message.startProcess('user_login_google',{
      navigate_to:'/',
      token:loginToken,
      user: new User(
        profile.getId(),
        profile.getEmail(),
        '','',
        '',
        'Google',
        loginToken,
        {
          accessKey:'',
          secretKey:'',
          sessionToken:'',
          expireTime: ''
        }
      )
    });
  }

  renderGoogleLoginButton() {
    gapi.signin2.render(
      'g-signin2',
      {
        onSuccess: this.handleGoogleLogin,
        scope: 'email'
      }
    );
  }

}
