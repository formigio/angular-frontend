import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine,
  ProcessContext, ProcessTask, WorkerComponent, ProcessTaskRegistration, WorkerBaseComponent } from '../core/index';
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
export class UserWorkerComponent extends WorkerBaseComponent implements OnInit {

    public routines: {} = {
        user_login: new ProcessRoutine(
            'user_login',
            'The Process Used to Control the Login'
        ),
        user_login_google: new ProcessRoutine(
            'user_login_google',
            'The Process Used to Control the Login with Google'
        ),
        user_google_api: new ProcessRoutine(
            'user_google_api',
            'The Process Used to Control the Login with Google'
        ),
        user_google_token_refresh: new ProcessRoutine(
            'user_google_token_refresh',
            'The Process Used to Control the Login with Google'
        ),
        user_register: new ProcessRoutine(
            'user_register',
            'The Process Used to Control the Registration of New Users'
        ),
        user_confirm: new ProcessRoutine(
            'user_confirm',
            'The Process Used to Control the Confirmation of New Users'
        ),
        user_load_for_app: new ProcessRoutine(
            'user_load_for_app',
            'The Process Used to Control the Initiation of App User'
        ),
        user_logout: new ProcessRoutine(
            'user_logout',
            'The Process Used to Control the Logout'
        ),
        user_update: new ProcessRoutine(
            'user_update',
            'The Process Used to Control the User Updates'
        ),
        user_test_username: new ProcessRoutine(
            'user_test_username',
            'The Process Used to Control the Testing of Usernames'
        )
    };

    public tasks: {} = {
        user_test_username_init: new ProcessTask(
            'test_username',
            'user_test_username_init',
            'user_test_username',
            'Test Username',
            'testUsername',
            (context:ProcessContext) => {
               return context.hasSignal('user_test_username_init');
            },
            {}
        ),
        user_load_for_app_init: new ProcessTask(
            'check_data_service',
            'user_load_for_app_init',
            'user_load_for_app',
            'Do Initial Check for Data Service',
            'checkDataService',
            (context:ProcessContext) => {
              return context.hasSignal('user_load_for_app_init');
            },
            {}
        ),
        check_data_service_complete: new ProcessTask(
            'start_google_api_on_load',
            'user_load_for_app_init',
            'user_load_for_app',
            'Start Google API',
            'startGoogleApi',
            (context:ProcessContext) => {
              return context.hasSignal('check_data_service_complete');
            },
            {}
        ),
        user_google_api_init: new ProcessTask(
            'start_google_api',
            'user_google_api_init',
            'user_google_api',
            'Start Google API',
            'startGoogleApi',
            (context:ProcessContext) => {
              return context.hasSignal('user_google_api_init');
            },
            {}
        ),
        user_update_init: new ProcessTask(
            'update_user_record',
            'user_update_init',
            'user_update',
            'Update User Record',
            'updateUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_update_init');
            },
            {user:'User'}
        ),
        update_user_record_complete: new ProcessTask(
            'store_user_record_after_update',
            'update_user_record_complete',
            'user_update',
            'Store User Record',
            'storeUser',
            (context:ProcessContext) => {
              return context.hasSignal('update_user_record_complete');
            },
            {user:'User'}
        ),
        store_user_record_after_update_complete: new ProcessTask(
            'redirect_after_user_update',
            'store_user_record_after_update_complete',
            'user_update',
            'Notify User They are Good To go, and Navigate them',
            'notifyNewUser',
            (context:ProcessContext) => {
              return context.hasSignal('store_user_record_after_update_complete');
            },
            {user:'User'}
        ),
        start_google_api_on_load_complete: new ProcessTask(
            'load_user_for_app',
            'start_google_api_on_load_complete',
            'user_load_for_app',
            'Load User into the App',
            'loadUserIntoApp',
            (context:ProcessContext) => {
              return context.hasSignal('start_google_api_on_load_complete');
            },
            {}
        ),
        user_login_init: new ProcessTask(
            'login_cognito_user',
            'user_login_init',
            'user_login',
            'Login User',
            'loginCognitoUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_login_init');
            },
            {user:'User'}
        ),
        confirm_cognito_user_complete: new ProcessTask(
            'login_cognito_user_after_confirm',
            'confirm_cognito_user_complete',
            'user_login',
            'Login User',
            'loginCognitoUser',
            (context:ProcessContext) => {
              return context.hasSignal('confirm_cognito_user_complete');
            },
            {user:'User'}
        ),
        user_login_google_init: new ProcessTask(
            'login_google_user',
            'user_login_google_init',
            'user_login_google',
            'Login Google User',
            'loginGoogleUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_login_google_init');
            },
            {token:'string',user:'User'}
        ),
        user_google_token_refresh_init: new ProcessTask(
            'refresh_google_token',
            'user_google_token_refresh_init',
            'user_google_token_refresh',
            'Refresh Google Token',
            'refreshGoogleUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_google_token_refresh_init');
            },
            {token:'string',user:'User'}
        ),
        refresh_google_token_complete: new ProcessTask(
            'store_refreshed_user',
            'refresh_google_token_complete',
            'user_google_token_refresh',
            'Store Refreshed User',
            'storeUser',
            (context:ProcessContext) => {
              return context.hasSignal('refresh_google_token_complete');
            },
            {user:'User',token:'string'}
        ),
        login_cognito_user_complete: new ProcessTask(
          'swap_token',
          'login_cognito_user_complete',
          'login_user',
          'Swap the Tokens',
          'swapToken',
          (context:ProcessContext) => {
            return context.hasSignal('login_cognito_user_complete') || context.hasSignal('login_cognito_user_after_confirm_complete');
          },
          {user:'User'}
        ),
        store_google_user_complete: new ProcessTask(
          'fetch_user_worker',
          'store_google_user_complete',
          'user_login_google',
          'Store Authenticated User',
          'fetchUserWorker',
          (context:ProcessContext) => {
            return context.hasSignal('store_google_user_complete');
          },
          {
            user:'User'
          }
        ),
        login_google_user_complete: new ProcessTask(
          'store_google_user',
          'login_google_user_complete',
          'user_login_google',
          'Store Authenticated User',
          'storeUser',
          (context:ProcessContext) => {
            return context.hasSignal('login_google_user_complete');
          },
          {
            user:'User'
          }
        ),
        fetch_user_worker_complete: new ProcessTask(
          'store_user_worker',
          'fetch_user_worker_complete',
          'user_login',
          'Store User Worker',
          'storeUser',
          (context:ProcessContext) => {
            return context.hasSignal('fetch_user_worker_complete');
          },
          {
            user:'User'
          }
        ),
        swap_token_complete: new ProcessTask(
          'store_congito_user',
          'login_cognito_user_complete',
          'user_login',
          'Store Authenticated User',
          'storeUser',
          (context:ProcessContext) => {
            return context.hasSignal('swap_token_complete');
          },
          {
            user:'User'
          }
        ),
        store_congito_user_complete: new ProcessTask(
          'fetch_user_worker',
          'store_congito_user_complete',
          'user_login',
          'Store Authenticated User',
          'fetchUserWorker',
          (context:ProcessContext) => {
            return context.hasSignal('store_congito_user_complete');
          },
          {
            user:'User'
          }
        ),
        fetch_google_user_worker_complete: new ProcessTask(
          'store_google_user',
          'fetch_user_worker_complete',
          'user_login_google',
          'Store the Google User for the app',
          'storeUser',
          (context:ProcessContext) => {
            return context.hasSignal('fetch_user_worker_complete');
          },
          {
            user:'User'
          }
        ),
        user_register_init: new ProcessTask(
            'create_cognito_user',
            'user_register_init',
            'user_register',
            'Login User',
            'createCognitoUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_register_init');
            },
            {user:'User'}
        ),
        user_confirm_init: new ProcessTask(
            'confirm_cognito_user',
            'user_confirm_init',
            'user_confirm',
            'Confirm User',
            'confirmCognitoUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_confirm_init');
            },
            {user:'User'}
        ),
        user_logout_init: new ProcessTask(
            'user_logout',
            'user_logout_init',
            'user_logout',
            'Logout User',
            'logoutUser',
            (context:ProcessContext) => {
              return context.hasSignal('user_logout_init');
            },
            {}
        ),
        team_save_init: new ProcessTask(
            'get_user_for_save_team',
            'team_save_init',
            'team_save',
            'Put User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('team_save_init');
            },
            {}
        ),
        team_create_init: new ProcessTask(
            'get_user_for_create_team',
            'team_create_init',
            'team_create',
            'Put User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('team_create_init');
            },
            {}
        ),
        team_view_init: new ProcessTask(
            'get_user_for_view_team',
            'team_view_init',
            'team_view',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('team_view_init');
            },
            {}
        ),
        team_fetch_user_teams_init: new ProcessTask(
            'get_user_for_fetch_teams',
            'team_fetch_user_teams_init',
            'team_fetch_user_teams',
            'Put User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('team_fetch_user_teams_init');
            },
            {}
        ),
        teammember_add_init: new ProcessTask(
            'validate_user_as_teammember',
            'teammember_add_init',
            'teammember_add',
            'Put User in Process Context',
            'validateUser',
            (context:ProcessContext) => {
              return context.hasSignal('teammember_add_init');
            },
            {user_email:'string'}
        ),
        goal_view_init: new ProcessTask(
            'get_user_for_view_goal',
            'goal_view_init',
            'goal_view',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('goal_view_init');
            },
            {}
        ),
        load_goal_list_init: new ProcessTask(
            'get_user_for_load_goals',
            'load_goal_list_init',
            'load_goal_list',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('load_goal_list_init');
            },
            {}
        ),
        teammember_fetch_team_members_init: new ProcessTask(
            'get_user_for_load_teammembers',
            'teammember_fetch_team_members_init',
            'teammember_fetch_team_members',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('teammember_fetch_team_members_init');
            },
            {}
        ),
        create_goal_init: new ProcessTask(
            'get_user_for_create_goal',
            'create_goal_init',
            'create_goal',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('create_goal_init');
            },
            {}
        ),
        load_task_list_init: new ProcessTask(
            'get_user_for_load_task_list',
            'load_task_list_init',
            'load_task_list',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('load_task_list_init');
            },
            {}
        ),
        invite_fetch_init: new ProcessTask(
            'get_user_for_invite_fetch',
            'invite_fetch_init',
            'invite_fetch',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('invite_fetch_init');
            },
            {}
        ),
        invite_create_init: new ProcessTask(
            'get_user_for_invite_create',
            'invite_create_init',
            'invite_create',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('invite_create_init');
            },
            {}
        ),
        invite_view_init: new ProcessTask(
            'get_user_for_invite_view',
            'invite_view_init',
            'invite_view',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('invite_view_init');
            },
            {}
        ),
        goal_save_init: new ProcessTask(
            'get_user_for_goal_save',
            'goal_save_init',
            'goal_save',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('goal_save_init');
            },
            {}
        ),
        task_create_init: new ProcessTask(
            'get_user_for_task_create',
            'task_create_init',
            'task_create',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('task_create_init');
            },
            {}
        ),
        task_save_init: new ProcessTask(
            'get_user_for_task_save',
            'task_save_init',
            'task_save',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('task_save_init');
            },
            {}
        ),
        team_delete_init: new ProcessTask(
            'get_user_for_delete_team',
            'team_delete_init',
            'team_delete',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('team_delete_init');
            },
            {}
        ),
        task_delete_init: new ProcessTask(
            'get_user_for_delete_task',
            'task_delete_init',
            'task_delete',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('task_delete_init');
            },
            {}
        ),
        goal_delete_init: new ProcessTask(
            'get_user_for_goal_delete',
            'goal_delete_init',
            'goal_delete',
            'Get User in Process Context',
            'getUser',
            (context:ProcessContext) => {
              return context.hasSignal('goal_delete_init');
            },
            {}
        ),
        invite_accept_init: new ProcessTask(
          'get_user_for_invite_accept',
          'invite_accept_init',
          'invite_accept',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('invite_accept_init');
          },
          {}
        ),
        invite_delete_init: new ProcessTask(
          'get_user_for_invite_delete',
          'invite_delete_init',
          'invite_delete',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('invite_delete_init');
          },
          {}
        ),
        commitment_load_commitments_init: new ProcessTask(
          'get_user_for_load_commitments',
          'commitment_load_commitments_init',
          'commitment_load_commitments',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_load_commitments_init');
          },
          {}
        ),
        commitment_create_init: new ProcessTask(
          'get_user_for_commitment_create',
          'commitment_create_init',
          'commitment_create',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_create_init');
          },
          {}
        ),
        commitment_delete_init: new ProcessTask(
          'get_user_for_commitment_delete',
          'commitment_delete_init',
          'commitment_delete',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_delete_init');
          },
          {}
        ),
        commitment_task_save_init: new ProcessTask(
          'get_user_for_commitment_task_save',
          'commitment_task_save_init',
          'commitment_task_save',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_task_save_init');
          },
          {}
        ),
        process_every_minute_init: new ProcessTask(
          'check_user_for_keeping_active_user',
          'process_every_minute_init',
          'process_every_minute',
          'Get User for Process Context',
          'checkUser',
          (context:ProcessContext) => {
            return context.hasSignal('process_every_minute_init');
          },
          {}
        ),
        check_user_for_keeping_active_user_complete: new ProcessTask(
          'get_user_for_keeping_active_user',
          'process_every_minute_init',
          'process_every_minute',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('check_user_for_keeping_active_user_complete');
          },
          {}
        ),
        commitment_save_init: new ProcessTask(
          'get_user_for_commitment_save',
          'commitment_save_init',
          'commitment_save',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_save_init');
          },
          {}
        ),
        commitment_load_worker_commitments_init: new ProcessTask(
          'get_user_for_load_worker_commitments',
          'commitment_load_worker_commitments_init',
          'commitment_load_worker_commitments',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('commitment_load_worker_commitments_init');
          },
          {}
        ),
        goal_save_template_from_goal_init: new ProcessTask(
          'get_user_for_save_goal_template',
          'goal_save_template_from_goal_init',
          'goal_save_template_from_goal',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_save_template_from_goal_init');
          },
          {}
        ),
        refresh_google_token_error: new ProcessTask(
          'logout_after_google_token_refresh_failed',
          'refresh_google_token_error',
          'user_google_token_refresh',
          'Forced Logout after Google Token Refresh Fails',
          'logoutUser',
          (context:ProcessContext) => {
            return context.hasSignal('refresh_google_token_error');
          },
          {}
        ),
        fetch_user_worker_error: new ProcessTask(
          'redirect_to_register',
          'fetch_user_worker_error',
          'user_login_google',
          'Direct the user to Registration, since there is no worker',
          'registerUser',
          (context:ProcessContext) => {
            return context.hasSignal('fetch_user_worker_blocked');
          },
          {}
        ),
        goal_template_delete_init: new ProcessTask(
          'get_user_for_goal_template_delete',
          'goal_template_delete_init',
          'goal_template_delete',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_delete_init');
          },
          {}
        ),
        goal_template_view_init: new ProcessTask(
          'get_user_for_goal_template_view',
          'goal_template_view_init',
          'goal_template_view',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_view_init');
          },
          {}
        ),
        goal_template_load_list_init: new ProcessTask(
          'get_user_for_goal_template_load_list',
          'goal_template_load_list_init',
          'goal_template_load_list',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_load_list_init');
          },
          {}
        ),
        goal_template_create_init: new ProcessTask(
          'get_user_for_goal_template_create',
          'goal_template_create_init',
          'goal_template_create',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_create_init');
          },
          {}
        ),
        goal_template_save_init: new ProcessTask(
          'get_user_for_goal_template_save',
          'goal_template_save_init',
          'goal_template_save',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_save_init');
          },
          {}
        ),
        task_template_delete_init: new ProcessTask(
          'get_user_for_task_template_delete',
          'task_template_delete_init',
          'task_template_delete',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_template_delete_init');
          },
          {}
        ),
        task_template_view_init: new ProcessTask(
          'get_user_for_task_template_view',
          'task_template_view_init',
          'task_template_view',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_template_view_init');
          },
          {}
        ),
        task_template_load_list_init: new ProcessTask(
          'get_user_for_task_template_load_list',
          'task_template_load_list_init',
          'task_template_load_list',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_template_load_list_init');
          },
          {}
        ),
        task_template_create_init: new ProcessTask(
          'get_user_for_task_template_create',
          'task_template_create_init',
          'task_template_create',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_template_create_init');
          },
          {}
        ),
        task_template_save_init: new ProcessTask(
          'get_user_for_task_template_save',
          'task_template_save_init',
          'task_template_save',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_template_save_init');
          },
          {}
        ),
        goal_template_to_goal_init: new ProcessTask(
          'get_user_for_goal_template_to_goal',
          'goal_template_to_goal_init',
          'goal_template_to_goal',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_to_goal_init');
          },
          {}
        ),
        goal_template_search_init: new ProcessTask(
          'get_user_for_goal_template_search',
          'goal_template_search_init',
          'goal_template_search',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('goal_template_search_init');
          },
          {}
        ),
        notification_fetch_list_init: new ProcessTask(
          'get_user_for_notification_fetch_list',
          'notification_fetch_list_init',
          'notification_fetch_list',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('notification_fetch_list_init');
          },
          {}
        ),
        notification_save_init: new ProcessTask(
          'get_user_for_notification_save',
          'notification_save_init',
          'notification_save',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('notification_save_init');
          },
          {}
        ),
        task_fetch_init: new ProcessTask(
          'get_user_for_task_fetch',
          'task_fetch_init',
          'task_fetch',
          'Get User for Process Context',
          'getUser',
          (context:ProcessContext) => {
            return context.hasSignal('task_fetch_init');
          },
          {}
        )
    };

  constructor(
    protected service: UserService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    super();
    this.service = this.helper.getServiceInstance(this.service,'UserService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.subscribe();

    // Start User Process
    this.message.startProcess('user_load_for_app',{});
  }

  public notifyNewUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.message.addStickyMessage('Welcome to Formigio, yur all set. ;)','success','auth');
      this.message.startProcess('navigate_to',{navigate_to:'/teams'});
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message: {
          message: 'Ready? Begin.',
          queue: 'process',
          channel: 'auth'
        },
        context:{params:{user:user}}
      });
      observer.complete();
    });
    return obs;
  }

  public registerUser(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.message.addStickyMessage('Please Register to Continue.','warning','auth');
      this.message.startProcess('navigate_to',{navigate_to:'/register'});
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message: {
          message: 'Registration Maybe Required.',
          alert: 'warning',
          queue: 'process',
          channel: 'auth'
        },
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
            message: {
              message: 'Testing Username'
            },
            context:{params:{user:user}}
          });
          observer.complete();
        }).catch((response:any) => {
          console.log(response);
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message: {
              message: 'System Error.'
            },
           context:{params:{}}
          });
        });
    });
    return obs;
  }

  public checkDataService(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      this.service.status()
        .then((response:any) => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:{},
            context:{params:{}}
          });
          observer.complete();
        }).catch((response:any) => {
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message: {
             message: 'There is a problem with the Data Service.',
             queue: 'sticky',
             channel: 'app'
           },
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
            message: {
              message: 'Looks like you are all logged in, Welcome Back.',
              channel: 'auth',
              queue: 'process'
            },
            context:{params:{user:user}}
          });
          observer.complete();
        }).catch((response:any) => {
          console.log(response);
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message: {
              message: 'No Worker Record Found.'
            },
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
          message: {
            message: 'Google API Initiated.'
          },
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
              message: {
                message: 'Worker Record Found.'
              },
              context:{params:{user:user}}
            });
            observer.complete();
          }).catch((response:any) => {
            console.log(response);
            observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: {
              message: 'No Worker Record Found.'
            },
            context:{params:{}}
            });
          });
      } else {
        this.service.put(user)
          .then((response:any) => {
            user.worker = response.data;
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message: {
                message: 'Worker Record Found.'
              },
              context:{params:{user:user}}
            });
            observer.complete();
          }).catch((response:any) => {
            console.log(response);
            observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: {
              message: 'No Worker Record Found.'
            },
            context:{params:{}}
            });
          });
      }
    });
    return obs;
  }

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
              message: {
                message: 'User Registration Failed. ('+err+')'
              },
              context:{params:{}}
            });
            return;
          } else {
            this.message.addStickyMessage('Please check your email and enter the confirmation code below.','success','auth');
            let cognitoUser = result.user;
            observer.next({
              control_uuid: control_uuid,
              outcome: 'success',
              message: {
                message: 'Cognito User is Registered.'
              },
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
              message: {
                message: 'It looks like we need to get you logged back in.',
                queue: 'sticky',
                channel: 'auth'
              },
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
            message: {
              message: 'Google User is Authenticated.',
              queue: 'process',
              channel: 'auth'
            },
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
              message: {
                message: 'It looks like we need to get you logged back in.',
                queue: 'sticky',
                channel: 'auth'
              },
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
            message: {
              message: 'Google User is Authenticated.'
            },
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
              message: {
                message: 'Cognito User is Authenticated.'
              },
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
              message: {
                message: 'User Registration Failed. ('+err+')'
              },
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
              message: {
                message: 'Login Failed. ('+err+')'
              },
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
            message: {
              message: 'Login Successful, Welcome Back!'
            },
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
              message: {
                message: 'User Confirm Failed. ('+err+')'
              },
              context:{params:{}}
            });
            return;
          }
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message: {
              message: 'Your Account has been confirmed. Please login to start using Formigio',
              channel: 'auth',

            },
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
        message:'User Stored.',
        context:{params:{}}
      });
      observer.complete();
      if(user.worker.id) {
        this.message.startProcess('notification_connect',{
          url:Config.NOTIFICATION_WS + '/worker/' + user.worker.id
        });
      }
    });
    return obs;
  }

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
          message: {
            message: 'Tokens needs a refresh, please try again... Or you may need to logout and log back in.',
            channel: 'auth'
          },
          context:{params:{}}
        });
      }

      if(!user.worker.id) {
        observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message: {
            message: 'We can\'t identify who you are, exactly. Your Formigio Worker ID is not Valid, please contact support.',
            channel: 'auth'
          },
          context:{params:{}}
        });
      } else {
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message: {},
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
          message: {
            message: 'Authentication Required',
            channel: 'auth'
          },
          context:{params:{}}
        });
      } else {
        this.service.publishUser(user);
        observer.next({
          control_uuid: control_uuid,
          outcome: 'success',
          message: {
            message: 'User Loaded'
          },
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
        message: {
          message: 'Logout Successful.'
        },
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

}
