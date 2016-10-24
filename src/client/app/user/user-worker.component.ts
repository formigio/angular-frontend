import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { HelperService } from '../shared/index';
import { User, UserService } from './index';

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
        user_login_init: new ProcessTask(
            'get_hash',
            'user_login_init',
            'Login User',
            'getHash',
            {user:'User'}
        ),
        user_logout_init: new ProcessTask(
            'user_logout',
            'user_logout_init',
            'Logout User',
            'logoutUser',
            {}
        ),
        get_hash_complete: new ProcessTask(
            'login_user',
            'get_hash_complete',
            'Login User',
            'loginUser',
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
          user.uuid = response.uuid;
          this.service.publishUser(user);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Credentials Tested.',
            context:{params:{logged_in:response.uuid,navigate_to:'/',user:user}}
          });
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

