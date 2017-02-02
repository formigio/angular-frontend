import { Component, AfterViewInit } from '@angular/core';
import { MessageService } from '../core/index';
import { User, UserStruct } from '../user/index';

declare let gapi:any;

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'google-button',
  templateUrl: 'google-button.component.html'
})
export class GoogleButtonComponent implements AfterViewInit {

  constructor(
    public message:MessageService
  ) { }

  ngAfterViewInit() {
    this.renderGoogleLoginButton();
    this.message.startProcess('user_google_api',{identity_provider:'google'});
  }

  handleGoogleLogin = (googleUser:any) => {
    let user:User = UserStruct;

    user.email = googleUser.getBasicProfile().getEmail();
    user.identity_provider = 'google';
    user.login_token = googleUser.getAuthResponse().id_token;
    user.login_token_expires = googleUser.getAuthReponse().expires_at;

    this.message.startProcess('user_login_google',{
      navigate_to:'/',
      token:user.login_token,
      user: user
    });
  }

  renderGoogleLoginButton() {
    gapi.load('signin2',() => {
      gapi.signin2.render(
        'g-signin2',
        {
          onSuccess: this.handleGoogleLogin,
          scope: 'email'
        }
      );
    });
  }

}
