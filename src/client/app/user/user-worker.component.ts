import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { Config } from '../shared/index';
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
        user_google_api: new ProcessRoutine(
            'user_google_api',
            'The Process Used to Control the Login with Google',
            new ProcessContext,
            ''
        ),
        user_google_token_refresh: new ProcessRoutine(
            'user_google_token_refresh',
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
        ),
        user_update: new ProcessRoutine(
            'user_update',
            'The Process Used to Control the User Updates',
            new ProcessContext,
            ''
        ),
        user_test_username: new ProcessRoutine(
            'user_test_username',
            'The Process Used to Control the Testing of Usernames',
            new ProcessContext,
            ''
        )
    };

    public tasks: {} = {
        user_test_username_init: new ProcessTask(
            'test_username',
            'user_test_username_init',
            'Test Username',
            'testUsername',
            {}
        ),
        user_load_for_app_init: new ProcessTask(
            'start_google_api_on_load',
            'user_load_for_app_init',
            'Start Google API',
            'startGoogleApi',
            {}
        ),
        user_google_api_init: new ProcessTask(
            'start_google_api',
            'user_google_api_init',
            'Start Google API',
            'startGoogleApi',
            {}
        ),
        user_update_init: new ProcessTask(
            'update_user_record',
            'user_update_init',
            'Update User Record',
            'updateUser',
            {user:'User'}
        ),
        update_user_record_complete: new ProcessTask(
            'store_user_record_after_update',
            'update_user_record_complete',
            'Store User Record',
            'storeUser',
            {user:'User'}
        ),
        store_user_record_after_update_complete: new ProcessTask(
            'redirect_after_user_update',
            'store_user_record_after_update_complete',
            'Notify User They are Good To go, and Navigate them',
            'notifyNewUser',
            {user:'User'}
        ),
        start_google_api_on_load_complete: new ProcessTask(
            'load_user_for_app',
            'start_google_api_on_load_complete',
            'Load User into the App',
            'loadUserIntoApp',
            {}
        ),
        // load_user_for_app_complete: new ProcessTask(
        //     'test_user_auth',
        //     'load_user_for_app_complete',
        //     'Test User Auth',
        //     'testUserAuth',
        //     {user:'User'}
        // ),
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
        confirm_cognito_user_complete: new ProcessTask(
            'login_cognito_user',
            'confirm_cognito_user_complete',
            'Login User',
            'loginCognitoUser',
            {user:'User'}
        ),
        user_login_google_init: new ProcessTask(
            'login_google_user',
            'user_login_google_init',
            'Login Google User',
            'loginGoogleUser',
            {token:'string',user:'User'}
        ),
        user_google_token_refresh_init: new ProcessTask(
            'refresh_google_token',
            'user_google_token_refresh_init',
            'Refresh Google Token',
            'refreshGoogleUser',
            {token:'string',user:'User'}
        ),
        refresh_google_token_complete: new ProcessTask(
            'store_refreshed_user',
            'refresh_google_token_complete',
            'Store Refreshed User',
            'storeUser',
            {user:'User',token:'string'}
        ),
        login_cognito_user_complete: new ProcessTask(
          'swap_token',
          'login_cognito_user_complete',
          'Swap the Tokens',
          'swapToken',
          {user:'User'}
        ),
        store_google_user_complete: new ProcessTask(
          'fetch_user_worker',
          'store_google_user_complete',
          'Store Authenticated User',
          'fetchUserWorker',
          {
            user:'User'
          }
        ),
        login_google_user_complete: new ProcessTask(
          'store_google_user',
          'login_google_user_complete',
          'Store Authenticated User',
          'storeUser',
          {
            user:'User'
          }
        ),
        fetch_user_worker_complete: new ProcessTask(
          'store_user_worker',
          'fetch_user_worker_complete',
          'Store User Worker',
          'storeUser',
          {
            user:'User'
          }
        ),
        swap_token_complete: new ProcessTask(
          'store_congito_user',
          'login_cognito_user_complete',
          'Store Authenticated User',
          'storeUser',
          {
            user:'User'
          }
        ),
        store_congito_user_complete: new ProcessTask(
          'fetch_user_worker',
          'store_congito_user_complete',
          'Store Authenticated User',
          'fetchUserWorker',
          {
            user:'User'
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
        team_view_init: new ProcessTask(
            'get_user_for_view_team',
            'team_view_init',
            'Get User in Process Context',
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
        ),
        goal_view_init: new ProcessTask(
            'get_user_for_view_goal',
            'goal_view_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        load_goal_list_init: new ProcessTask(
            'get_user_for_load_goals',
            'load_goal_list_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        teammember_fetch_team_members_init: new ProcessTask(
            'get_user_for_load_teammembers',
            'teammember_fetch_team_members_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        create_goal_init: new ProcessTask(
            'get_user_for_create_goal',
            'create_goal_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        load_task_list_init: new ProcessTask(
            'get_user_for_load_task_list',
            'load_task_list_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        invite_fetch_init: new ProcessTask(
            'get_user_for_invite_fetch',
            'invite_fetch_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        invite_create_init: new ProcessTask(
            'get_user_for_invite_create',
            'invite_create_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        invite_view_init: new ProcessTask(
            'get_user_for_invite_view',
            'invite_view_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        goal_save_init: new ProcessTask(
            'get_user_for_goal_save',
            'goal_save_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        task_create_init: new ProcessTask(
            'get_user_for_task_create',
            'task_create_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        task_save_init: new ProcessTask(
            'get_user_for_task_save',
            'task_save_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        team_delete_init: new ProcessTask(
            'get_user_for_delete_team',
            'team_delete_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        task_delete_init: new ProcessTask(
            'get_user_for_delete_task',
            'task_delete_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        goal_delete_init: new ProcessTask(
            'get_user_for_goal_delete',
            'goal_delete_init',
            'Get User in Process Context',
            'getUser',
            {}
        ),
        invite_accept_init: new ProcessTask(
          'get_user_for_invite_accept',
          'invite_accept_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        invite_delete_init: new ProcessTask(
          'get_user_for_invite_delete',
          'invite_delete_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_load_commitments_init: new ProcessTask(
          'get_user_for_load_commitments',
          'commitment_load_commitments_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_create_init: new ProcessTask(
          'get_user_for_commitment_create',
          'commit_create_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_delete_init: new ProcessTask(
          'get_user_for_commitment_delete',
          'commit_delete_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_task_save_init: new ProcessTask(
          'get_user_for_commitment_task_save',
          'commitment_task_save_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        process_every_minute_init: new ProcessTask(
          'check_user_for_keeping_active_user',
          'process_every_minute_init',
          'Get User for Process Context',
          'checkUser',
          {}
        ),
        check_user_for_keeping_active_user_complete: new ProcessTask(
          'get_user_for_keeping_active_user',
          'process_every_minute_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_save_init: new ProcessTask(
          'get_user_for_commitment_save',
          'commitment_save_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        commitment_load_worker_commitments_init: new ProcessTask(
          'get_user_for_load_worker_commitments',
          'commitment_load_worker_commitments_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        goal_save_template_init: new ProcessTask(
          'get_user_for_save_goal_template',
          'goal_save_template_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        refresh_google_token_error: new ProcessTask(
            'logout_after_google_token_refresh_failed',
            'refresh_google_token_error',
            'Forced Logout after Google Token Refresh Fails',
            'logoutUser',
            {}
        ),
        fetch_user_worker_error: new ProcessTask(
            'redirect_to_register',
            'fetch_user_worker_error',
            'Direct the user to Registration, since there is no worker',
            'registerUser',
            {}
        ),
        goal_template_delete_init: new ProcessTask(
          'get_user_for_goal_template_delete',
          'goal_template_delete_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        goal_template_view_init: new ProcessTask(
          'get_user_for_goal_template_view',
          'goal_template_view_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        goal_template_load_list_init: new ProcessTask(
          'get_user_for_goal_template_load_list',
          'goal_template_load_list_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        goal_template_create_init: new ProcessTask(
          'get_user_for_goal_template_create',
          'goal_template_create_init',
          'Get User for Process Context',
          'getUser',
          {}
        ),
        goal_template_save_init: new ProcessTask(
          'get_user_for_goal_template_save',
          'goal_template_save_init',
          'Get User for Process Context',
          'getUser',
          {}
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
      if(Object.keys(this.routines).length > 0) {
        this.message.getProcessQueue().subscribe(
          message => {
            // Process Inits
            message.initProcess(this);
          }
        );
      }
      // Process Tasks based on messages received
      if(Object.keys(this.tasks).length > 0) {
        this.message.getWorkerQueue().subscribe(
          message => {
            // Process Signals
            message.processSignal(this);
          }
        );
      }

      // Start User Process
      this.message.startProcess('user_load_for_app',{});
  }

  // public getHash(control_uuid: string, params: any): Observable<any> {
  //   let user: User = params.user;
  //   let obs = new Observable((observer:any) => {
  //     let hash = this.service.password(user);
  //     hash.subscribe(
  //       response => {
  //         observer.next({
  //           control_uuid: control_uuid,
  //           outcome: 'success',
  //           message:'Credentials Processed.',
  //           context:{params:{password_hash:response.password_hash}}
  //         });
  //       },
  //       error => {
  //         observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'Password Hash Failed.',
  //           context:{params:{}}
  //         });
  //       },
  //       () => observer.complete()
  //     );
  //   });
  //   return obs;
  // }

  // public loginUser(control_uuid: string, params: any): Observable<any> {
  //   let user: User = params.user;
  //   user.password = params.password_hash;
  //   let obs = new Observable((observer:any) => {
  //     let auth = this.service.authenticateUser(user);
  //     auth.subscribe(
  //       response => {
  //         if(response.uuid === '') {
  //           observer.error({
  //             control_uuid: control_uuid,
  //             outcome: 'error',
  //             message:'Login Failed.',
  //             context:{params:{}}
  //           });
  //         } else {
  //           user.uuid = response.uuid;
  //           this.service.publishUser(user);
  //           observer.next({
  //             control_uuid: control_uuid,
  //             outcome: 'success',
  //             message:'Credentials Tested.',
  //             context:{params:{logged_in:response.uuid,navigate_to:'/',user:user}}
  //           });
  //         }
  //       },
  //       error => {
  //         observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'Login Failed.',
  //           context:{params:{}}
  //         });
  //       },
  //       () => observer.complete()
  //     );
  //   });
  //   return obs;
  // }

  // public validateUser(control_uuid: string, params: any): Observable<any> {
  //   let userEmail: string = params.user_email;
  //   let obs = new Observable((observer:any) => {
  //     let auth = this.service.validateUser(userEmail);
  //     auth.subscribe(
  //       response => {
  //         observer.next({
  //           control_uuid: control_uuid,
  //           outcome: 'success',
  //           message:'Team Member Validated.',
  //           context:{params:{user_uuid:response.uuid}}
  //         });
  //       },
  //       error => {
  //         observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'User Not Found.',
  //           context:{params:{}}
  //         });
  //       },
  //       () => observer.complete()
  //     );
  //   });
  //   return obs;
  // }

  public notifyNewUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.message.addStickyMessage('Welcome to Formigio, yur all set. ;)','success');
      this.message.startProcess('navigate_to',{navigate_to:'/teams'});
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Ready? Begin.',
        context:{params:{user:user}}
      });
      observer.complete();
    });
    return obs;
  }

  public registerUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.message.addStickyMessage('Please Register to Continue.','warning');
      this.message.startProcess('navigate_to',{navigate_to:'/register'});
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Registration Maybe Required.',
        context:{params:{user:user}}
      });
      observer.complete();
    });
    return obs;
  }

  public testUsername(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let validUsername: boolean = false;
    let obs = new Observable((observer:any) => {
      // Return Complete if Username Doesn't Exist
      this.service.count(user.worker.username)
        .then((response:any) => {
          validUsername = !Boolean(response.data.worker_count);
          this.service.publishUsername(validUsername);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Testing Username',
            context:{params:{user:user}}
          });
          observer.complete();
        }).catch((response:any) => {
          console.log(response);
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message:'System Error.',
           context:{params:{}}
          });
        });
    });
    return obs;
  }

  public fetchUserWorker(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.get()
        .then((response:any) => {
          user.worker = response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Worker Record Found.',
            context:{params:{user:user}}
          });
          observer.complete();
        }).catch((response:any) => {
          console.log(response);
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message:'No Worker Record Found.',
           context:{params:{}}
          });
        });
    });
    return obs;
  }

  public startGoogleApi(control_uuid: string, params: any): Observable<any> {
    // let provider:string = params.identity_provider;
    let obs = new Observable((observer:any) => {

        let auth2 = this.service.getGoogleAuth();
        if(typeof auth2 === 'undefined') {
          this.service.loadGoogleApi();
        } else {
          if (auth2.isSignedIn.get() === true) {
            auth2.signIn();
          }
        }

        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'Google API Initiated.',
          context:{params:{}}
        });
        observer.complete();

    });
    return obs;
  }

  public updateUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      if(!user.worker.id) {
        this.service.post(user)
          .then((response:any) => {
            user.worker = response.data;
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Worker Record Found.',
              context:{params:{user:user}}
            });
            observer.complete();
          }).catch((response:any) => {
            console.log(response);
            observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'No Worker Record Found.',
            context:{params:{}}
            });
          });
      } else {
        this.service.put(user)
          .then((response:any) => {
            user = response.data;
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Worker Record Found.',
              context:{params:{user:user}}
            });
            observer.complete();
          }).catch((response:any) => {
            console.log(response);
            observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'No Worker Record Found.',
            context:{params:{}}
            });
          });
      }
    });
    return obs;
  }

  // public createUser(control_uuid: string, params: any): Observable<any> {
  //   let user: User = params.user;
  //   user.password = params.password_hash;
  //   let obs = new Observable((observer:any) => {
  //     user.uuid = Math.random().toString().split('.').pop();
  //     let create = this.service.createUser(user);
  //     create.subscribe(
  //       response => {
  //         user.uuid = response.uuid;
  //         user.password = '';
  //         this.service.publishUser(user);
  //         observer.next({
  //           control_uuid: control_uuid,
  //           outcome: 'success',
  //           message:'User Credentials Saved, Login to Continue.',
  //           context:{params:{user_created:response.uuid,navigate_to:'/login',user:user}}
  //         });
  //       },
  //       error => {
  //         observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message:'User Registration Failed.',
  //           context:{params:{}}
  //         });
  //       },
  //       () => observer.complete()
  //     );
  //   });
  //   return obs;
  // }

  public createCognitoUser(control_uuid: string, params: any): Observable<any> {

    let user: User = params.user;

    AWSCognito.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : Config.COGNITO_USERPOOL,
      ClientId : Config.COGNITO_CLIENT_ID
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
            this.message.addStickyMessage('Please check your email and enter the confirmation code below.','success');
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

  public refreshGoogleUser(control_uuid: string, params: any): Observable<any> {
    let token: string = params.token;
    let user: User = params.user;
    let provider_expire: string;

    AWS.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let auth2 = this.service.getGoogleAuth();
    if(typeof auth2 !== 'undefined') {
      if (auth2.isSignedIn.get() === true) {
        auth2.signIn();
      }
      let googleUser = auth2.currentUser.get();
      token = googleUser.getAuthResponse().id_token;
      provider_expire = googleUser.getAuthResponse().expires_at;
    }

    let url = 'accounts.google.com';
    let logins:{} = {};
    (<any>logins)[url] = token;
    let loginparams = {
      IdentityPoolId: Config.COGNITO_IDENTITYPOOL, /* required */
      Logins: logins
    };

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(loginparams);

    let obs = new Observable((observer:any) => {

      AWS.config.credentials.refresh((err:any) => {
          if(err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'It looks like we need to get you logged back in.',
              context:{params:{}}
            });
          }

          user.login_token = token;
          user.login_token_expires = provider_expire;
          user.credentials.accessKey = AWS.config.credentials.accessKeyId;
          user.credentials.secretKey = AWS.config.credentials.secretAccessKey;
          user.credentials.sessionToken = AWS.config.credentials.sessionToken;
          user.credentials.expireTime = AWS.config.credentials.expireTime;
          if(AWS.config.credentials.identityId) {
            user.worker.identity = AWS.config.credentials.identityId.split(':').pop();
          }

          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Google User is Authenticated.',
            context:{params:{
              user:user
            }}
          });
          observer.complete();
      });
    });
    return obs;
  }

  public loginGoogleUser(control_uuid: string, params: any): Observable<any> {
    let token: string = params.token;
    let user: User = params.user;

    AWS.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let url = 'accounts.google.com';
    let logins:{} = {};
    (<any>logins)[url] = token;
    let loginparams = {
      IdentityPoolId: Config.COGNITO_IDENTITYPOOL, /* required */
      Logins: logins
    };

    AWS.config.credentials = new AWS.CognitoIdentityCredentials(loginparams);

    let obs = new Observable((observer:any) => {

      AWS.config.credentials.get((err:any) => {
          if(err) {
            observer.error({
              control_uuid: control_uuid,
              outcome: 'error',
              message:'It looks like we need to get you logged back in.',
              context:{params:{}}
            });
          }

          user.credentials.accessKey = AWS.config.credentials.accessKeyId;
          user.credentials.secretKey = AWS.config.credentials.secretAccessKey;
          user.credentials.sessionToken = AWS.config.credentials.sessionToken;
          user.credentials.expireTime = AWS.config.credentials.expireTime;
          if(AWS.config.credentials.identityId) {
            user.worker.identity = AWS.config.credentials.identityId.split(':').pop();
          }

          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Google User is Authenticated.',
            context:{params:{
              user:user
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

    AWSCognito.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : Config.COGNITO_USERPOOL,
      ClientId : Config.COGNITO_CLIENT_ID
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
            console.log(result);
            user.identity_provider = 'Cognito';
            user.password = '';
            user.login_token = result.getIdToken().getJwtToken();
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message:'Cognito User is Authenticated.',
              context:{params:{
                navigate_to:'/',
                user:user
              }}
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

    let token: string = params.user.login_token;
    let user: User = params.user;

    AWS.config.region = Config.AWS_REGION; //This is required to derive the endpoint
    AWSCognito.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let url = 'cognito-idp.us-east-1.amazonaws.com/' + Config.COGNITO_USERPOOL;
    let logins:{} = {};
    (<any>logins)[url] = token;
    let loginparams = {
      IdentityPoolId: Config.COGNITO_IDENTITYPOOL, /* required */
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
              message:'Login Failed. ('+err+')',
              context:{params:{}}
            });
          }

          user.credentials.accessKey = AWS.config.credentials.accessKeyId;
          user.credentials.secretKey = AWS.config.credentials.secretAccessKey;
          user.credentials.sessionToken = AWS.config.credentials.sessionToken;
          user.credentials.expireTime = AWS.config.credentials.expireTime;
          if(AWS.config.credentials.identityId) {
            user.worker.identity = AWS.config.credentials.identityId.split(':').pop();
          }

          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'User is Authenticated.',
            context:{params:{
              user:user
            }}
          });
          observer.complete();
      });

    });
    return obs;
  }

  public confirmCognitoUser(control_uuid: string, params: any): Observable<any> {

    let user: User = params.user;

    AWSCognito.config.region = Config.AWS_REGION; //This is required to derive the endpoint

    let poolData = {
      UserPoolId : Config.COGNITO_USERPOOL,
      ClientId : Config.COGNITO_CLIENT_ID
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
      this.service.storeUser(user);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'User Saved.',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }



  // public storeUserIdentity(control_uuid: string, params: any): Observable<any> {
  //   let user_identity: string = params.user_identity;
  //   let obs = new Observable((observer:any) => {
  //     let user = this.service.retrieveUser();
  //     user.worker.identity = user_identity;
  //     this.service.storeUser(user);
  //     observer.next({
  //       control_uuid: control_uuid,
  //       outcome: 'success',
  //       message:'User Updated.',
  //       context:{params:{}}
  //     });
  //     observer.complete();
  //   });
  //   return obs;
  // }

  public checkUser(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      let user:User = this.service.retrieveUser();

      if(!user.email) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'invalid',
          message: '',
          context:{params:{}}
        });
      } else {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'',
          context:{params:{user:user}}
        });
        observer.complete();
      }

    });
    return obs;
  }

  public getUser(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      let user:User = this.service.retrieveUser();

      // Check Expired for Expired Tokens
      let current = new Date();
      let future = new Date();
      future.setTime(future.getTime() + (60000*15)); // Get a date in the future 15 mins
      let expire = new Date(user.credentials.expireTime);

      // If the token is about to expire we start the refresh token process.
      if(future > expire) {
        if(user.identity_provider === 'google') {
          this.message.startProcess('user_google_token_refresh',{user:user,token:user.login_token,navigate_to:'/login'});
        }
      }

      if(current > expire) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'token_expired',
          message: 'Tokens needs a refresh, please try again... Or you may need to logout and log back in.',
          context:{params:{}}
        });
      }

      if(!user.worker.id) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'We can\'t identify who you are, exactly. So, we might need to get you logged in or registered.',
          context:{params:{}}
        });
      } else {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'',
          context:{params:{user:user}}
        });
        observer.complete();
      }
    });
    return obs;
  }

  public loadUserIntoApp(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      let user:User = this.service.retrieveUser();
      if(!user.credentials.accessKey) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Authentication Required',
          context:{params:{}}
        });
      } else {
        this.service.publishUser(user);
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message:'User Loaded',
          context:{params:{user:user}}
        });
        observer.complete();
      }
    });
    return obs;
  }

  public logoutUser(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      this.service.logout();
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

  // public testUserAuth(control_uuid: string, params: any): Observable<any> {
  //   let user: User = params.user;
  //   let obs = new Observable((observer:any) => {
  //     this.service.auth(user).then((response:any) => {
  //         observer.next({
  //           control_uuid: control_uuid,
  //           outcome: 'success',
  //           message:'Auth successful.',
  //           context:{params:{}}
  //         });
  //         observer.complete();
  //       }).catch((error:any) => {
  //         let message = 'Auth Test Failed.';
  //         if(error.status === 403) {
  //           message = 'User Login Required';
  //           this.message.startProcess('user_logout',{});
  //         }
  //         if(error.status === 0) {
  //           message = 'Network Error';
  //         }
  //         observer.error({
  //           control_uuid: control_uuid,
  //           outcome: 'error',
  //           message: message,
  //           context:{
  //             params:{
  //               navigate_to: '/login'
  //             }
  //           }
  //       });
  //     });
  //   });
  //   return obs;
  // }

}
