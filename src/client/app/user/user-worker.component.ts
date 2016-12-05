import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
import { User, UserService } from './index';

declare let AWSCognito: any;
declare let AWS: any;
declare let apigClientFactory: any;

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'user-worker',
  template: `<div></div>`,
  providers: [ UserService ]
})
export class UserWorkerComponent implements OnInit, WorkerComponent {

    public routines: {} = {
        user_login: new ProcessRoutine(
            'user_login',
            'The Process Used to Control the Login',
            new ProcessContext,
            ''
        ),
        user_login_google: new ProcessRoutine(
            'user_login_google',
            'The Process Used to Control the Login with Google',
            new ProcessContext,
            ''
        ),
        user_register: new ProcessRoutine(
            'user_register',
            'The Process Used to Control the Registration of New Users',
            new ProcessContext,
            ''
        ),
        user_confirm: new ProcessRoutine(
            'user_confirm',
            'The Process Used to Control the Confirmation of New Users',
            new ProcessContext,
            ''
        ),
        user_load_for_app: new ProcessRoutine(
            'user_load_for_app',
            'The Process Used to Control the Initiation of App User',
            new ProcessContext,
            ''
        ),
        user_logout: new ProcessRoutine(
            'user_logout',
            'The Process Used to Control the Logout',
            new ProcessContext,
            ''
        )
    };

    public tasks: {} = {
        user_load_for_app_init: new ProcessTask(
            'load_user_for_app',
            'user_load_for_app_init',
            'Load User into the App',
            'loadUserIntoApp',
            {}
        ),
        // user_login_init: new ProcessTask(
        //     'get_hash_for_login',
        //     'user_login_init',
        //     'Login User',
        //     'getHash',
        //     {user:'User'}
        // ),
        user_login_init: new ProcessTask(
            'login_cognito_user',
            'user_login_init',
            'Login User',
            'loginCognitoUser',
            {user:'User'}
        ),
        user_login_google_init: new ProcessTask(
            'login_google_user',
            'user_login_google_init',
            'Login Google User',
            'loginGoogleUser',
            {token:'string'}
        ),
        login_cognito_user_complete: new ProcessTask(
          'swap_token',
          'login_cognito_user_complete',
          'Swap the Tokens',
          'swapToken',
          {id_token:'string'}
        ),
        login_google_user_complete: new ProcessTask(
          'test_authenticated',
          'login_google_user_complete',
          'Check Authenticated Call',
          'testAuthenticated',
          {
            accessKey:'string',
            secretKey:'string',
            sessionToken:'string'
          }
        ),
        swap_token_complete: new ProcessTask(
          'test_authenticated',
          'login_cognito_user_complete',
          'Check Authenticated Call',
          'testAuthenticated',
          {
            accessKey:'string',
            secretKey:'string',
            sessionToken:'string'
          }
        ),
        test_authenticated_complete: new ProcessTask(
          'store_google_user',
          'test_authenticated_complete',
          'Store the Google User for the app',
          'storeUser',
          {
            user:'User'
          }
        ),
        // user_register_init: new ProcessTask(
        //     'get_hash_for_register',
        //     'user_register_init',
        //     'Login User',
        //     'getHash',
        //     {user:'User'}
        // ),
        user_register_init: new ProcessTask(
            'create_cognito_user',
            'user_register_init',
            'Login User',
            'createCognitoUser',
            {user:'User'}
        ),
        user_confirm_init: new ProcessTask(
            'confirm_cognito_user',
            'user_confirm_init',
            'Confirm User',
            'confirmCognitoUser',
            {user:'User'}
        ),
        user_logout_init: new ProcessTask(
            'user_logout',
            'user_logout_init',
            'Logout User',
            'logoutUser',
            {}
        ),
        get_hash_for_login_complete: new ProcessTask(
            'login_user',
            'get_hash_for_login_complete',
            'Login User',
            'loginUser',
            {user:'User',password_hash:'string'}
        ),
        get_hash_for_register_complete: new ProcessTask(
            'register_user',
            'get_hash_for_register_complete',
            'Register User',
            'createUser',
            {user:'User',password_hash:'string'}
        ),
        login_user_complete: new ProcessTask(
            'store_user',
            'login_user_complete',
            'Store User in LocalStorage',
            'storeUser',
            {logged_in:'string',user:'User'}
        ),
        team_save_init: new ProcessTask(
            'get_user_for_save_team',
            'team_save_init',
            'Put User in Process Context',
            'getUser',
            {}
        ),
        team_create_init: new ProcessTask(
            'get_user_for_create_team',
            'team_create_init',
            'Put User in Process Context',
            'getUser',
            {}
        ),
        team_fetch_user_teams_init: new ProcessTask(
            'get_user_for_fetch_teams',
            'team_fetch_user_teams_init',
            'Put User in Process Context',
            'getUser',
            {}
        ),
        teammember_add_init: new ProcessTask(
            'validate_user_as_teammember',
            'teammember_add_init',
            'Put User in Process Context',
            'validateUser',
            {user_email:'string'}
        )
    };

  constructor(
    protected service: UserService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'UserService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
      // Subscribe to Process Queue
      // Process Tasks based on messages received
      if(Object.keys(this.tasks).length > 0) {
        this.message.getWorkerQueue().subscribe(
          message => {
            console.log(message.signal);
            // Process Signals
            message.processSignal(this);
          }
        );
      }
      if(Object.keys(this.routines).length > 0) {
        this.message.getProcessQueue().subscribe(
          message => {
            console.log(message.routine);
            // Process Inits
            message.initProcess(this);
          }
        );
      }
  }

  public getHash(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      let hash = this.service.password(user);
      hash.subscribe(
        response => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Credentials Processed.',
            context:{params:{password_hash:response.password_hash}}
          });
        },
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Password Hash Failed.',
            context:{params:{}}
          });
        },
        () => observer.complete()
      );
    });
    return obs;
  }

  public loginUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    user.password = params.password_hash;
    let obs = new Observable((observer:any) => {
      let auth = this.service.authenticateUser(user);
      auth.subscribe(
        response => {
          if(response.uuid === '') {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'Login Failed.',
              context:{params:{}}
            });
          } else {
            user.uuid = response.uuid;
            this.service.publishUser(user);
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Credentials Tested.',
              context:{params:{logged_in:response.uuid,navigate_to:'/',user:user}}
            });
          }
        },
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Login Failed.',
            context:{params:{}}
          });
        },
        () => observer.complete()
      );
    });
    return obs;
  }

  public validateUser(control_uuid: string, params: any): Observable<any> {
    let userEmail: string = params.user_email;
    let obs = new Observable((observer:any) => {
      let auth = this.service.validateUser(userEmail);
      auth.subscribe(
        response => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Team Member Validated.',
            context:{params:{user_uuid:response.uuid}}
          });
        },
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'User Not Found.',
            context:{params:{}}
          });
        },
        () => observer.complete()
      );
    });
    return obs;
  }

  public createUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    user.password = params.password_hash;
    let obs = new Observable((observer:any) => {
      user.password_hash = '';
      user.uuid = Math.random().toString().split('.').pop();
      let create = this.service.createUser(user);
      create.subscribe(
        response => {
          user.uuid = response.uuid;
          user.password = '';
          this.service.publishUser(user);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'User Credentials Saved, Login to Continue.',
            context:{params:{user_created:response.uuid,navigate_to:'/login',user:user}}
          });
        },
        error => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'User Registration Failed.',
            context:{params:{}}
          });
        },
        () => observer.complete()
      );
    });
    return obs;
  }

  public createCognitoUser(control_uuid: string, params: any): Observable<any> {

    let user: User = params.user;

    AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : 'us-east-1_0UqEwkU0H',
      ClientId : '3mj2tpe89ihqo412m9ckml6jk'
    };
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    let attributeList:any[] = [];

    let dataEmail = {
        Name : 'email',
        Value : user.email
    };
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    let obs = new Observable((observer:any) => {

      userPool.signUp(user.email, user.password, attributeList, null, (err:any, result:any) => {
          if (err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'User Registration Failed. ('+err+')',
              context:{params:{}}
            });
            return;
          } else {
          let cognitoUser = result.user;
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Cognito User is Registered.',
              context:{params:{user_created:cognitoUser.getUsername(),navigate_to:'/login',user:user}}
            });
            console.log('user name is ' + cognitoUser.getUsername());
            observer.complete();
          }
      });
    });
    return obs;
  }

  public loginGoogleUser(control_uuid: string, params: any): Observable<any> {
    let token: string = params.token;
    let user: User = params.user;

    AWS.config.region = 'us-east-1'; //This is required to derive the endpoint

    let url = 'accounts.google.com';
    let logins:{} = {};
    (<any>logins)[url] = token;
    let loginparams = {
      IdentityPoolId: 'us-east-1:38c1785e-4101-4eb4-b489-6fe8608406d0', /* required */
      Logins: logins
    };

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(loginparams);

    let obs = new Observable((observer:any) => {

      AWS.config.credentials.get((err:any) => {
          if(err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'User Registration Failed. ('+err+')',
              context:{params:{}}
            });
          }

          (<any>user.credentials).accessKey = AWS.config.credentials.accessKeyId;
          (<any>user.credentials).secretKey = AWS.config.credentials.secretAccessKey;
          (<any>user.credentials).sessionToken = AWS.config.credentials.sessionToken;

          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Cognito User is Authenticated.',
            context:{params:{
              user:user,
              accessKey:AWS.config.credentials.accessKeyId,
              secretKey:AWS.config.credentials.secretAccessKey,
              sessionToken:AWS.config.credentials.sessionToken
            }}
          });
          observer.complete();
      });
    });
    return obs;
  }

  public loginCognitoUser(control_uuid: string, params: any): Observable<any> {

    let user: User = params.user;

    var authenticationData = {
        Username : user.email,
        Password : user.password,
    };
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);

    AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : 'us-east-1_0UqEwkU0H',
      ClientId : '3mj2tpe89ihqo412m9ckml6jk'
    };
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username : user.email,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    let obs = new Observable((observer:any) => {

      cognitoUser.authenticateUser(authenticationDetails, {
          onSuccess: function (result:any) {
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Cognito User is Authenticated.',
              context:{params:{id_token:result.getIdToken().getJwtToken(),navigate_to:'/login',user:user}}
            });
            observer.complete();
          },
          onFailure: function(err:any) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'User Registration Failed. ('+err+')',
              context:{params:{}}
            });
          }
      });
    });
    return obs;
  }

  public swapToken(control_uuid: string, params: any): Observable<any> {

    let token: string = params.id_token;
    let user: User = params.user;

    AWS.config.region = 'us-east-1'; //This is required to derive the endpoint
    AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

    let url = 'cognito-idp.us-east-1.amazonaws.com/us-east-1_0UqEwkU0H';
    let logins:{} = {};
    (<any>logins)[url] = token;
    let loginparams = {
      IdentityPoolId: 'us-east-1:38c1785e-4101-4eb4-b489-6fe8608406d0', /* required */
      Logins: logins
    };

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(loginparams);
    AWSCognito.config.credentials = new AWS.CognitoIdentityCredentials(loginparams);

    let obs = new Observable((observer:any) => {

      AWS.config.credentials.get((err:any) => {
          if(err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'User Registration Failed. ('+err+')',
              context:{params:{}}
            });
          }

          user.credentials = AWS.config.credentials;

          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'User Keys Obtained.',
            context:{params:{
              user:user,
              accessKey:AWS.config.credentials.accessKeyId,
              secretKey:AWS.config.credentials.secretAccessKey,
              sessionToken:AWS.config.credentials.sessionToken
            }}
          });
          observer.complete();
      });
    });
    return obs;
  }

  public testAuthenticated(control_uuid: string, params: any): Observable<any> {
    let accessKey:string = params.accessKey;
    let secretKey:string = params.secretKey;
    let sessionToken:string = params.sessionToken;
    let api = apigClientFactory.newClient({
      accessKey: accessKey,
      secretKey: secretKey,
      sessionToken: sessionToken
    });
    let obs = new Observable((observer:any) => {
      api.authenticatedGet().then((result:any) => {
        console.log('200 Response from Gateway');
        console.log(result);
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'Authenticated Route Hit.',
          context:{params:{}}
        });
        observer.complete();
      }).catch((result:any) => {
        console.log('Error Response from Gateway');
        console.log(result);
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Authenticated Call Failed.' + result,
            context:{params:{}}
          });
      });
    });
    return obs;
  }

  public confirmCognitoUser(control_uuid: string, params: any): Observable<any> {

    let user: User = params.user;

    AWSCognito.config.region = 'us-east-1'; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : 'us-east-1_0UqEwkU0H',
      ClientId : '3mj2tpe89ihqo412m9ckml6jk'
    };
    let userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

    var userData = {
        Username : user.email,
        Pool : userPool
    };
    var cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    let obs = new Observable((observer:any) => {

      cognitoUser.confirmRegistration(user.confirm_code, false, function(err:any, result:any) {
          if (err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'User Confirm Failed. ('+err+')',
              context:{params:{}}
            });
            return;
          }
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Cognito User is Confirmed.',
            context:{params:{confirm_result:result,navigate_to:'/login',user:user}}
          });
          observer.complete();
        });
    });
    return obs;
  }

  public storeUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.helper.setAppState('user',user);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Login Successful.',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

  public getUser(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      let user:User = JSON.parse(localStorage.getItem('user'));
      if(!user.uuid) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Cannot Get User from Local Storage. ' + JSON.stringify(user),
          context:{params:{}}
        });
      } else {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'User Retrieved',
          context:{params:{user:user}}
        });
        observer.complete();
      }
    });
    return obs;
  }

  public loadUserIntoApp(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      let user:User = JSON.parse(localStorage.getItem('user'));
      this.service.publishUser(user);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'User Loaded',
        context:{params:{user:user}}
      });
      observer.complete();
    });
    return obs;
  }

  public logoutUser(control_uuid: string, params: any): Observable<any> {
    let user: User;
    let obs = new Observable((observer:any) => {
      this.service.logout();
      this.service.publishUser(user);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Logout Successful.',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }
}

