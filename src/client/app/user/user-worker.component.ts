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
        )
    };

    public tasks: {} = {
        user_login_init: new ProcessTask(
            'get_hash',
            'user_login_init',
            'Login User',
            'getHash',
            {user:'User'}
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
            // Process Signals
            message.processSignal(this);
          }
        );
      }
      if(Object.keys(this.routines).length > 0) {
        this.message.getProcessQueue().subscribe(
          message => {
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
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Credentials Tested.',
            context:{params:{logged_in:response.uuid,navigate_to:'/'}}
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
    let logged_in: string = params.logged_in;
    let obs = new Observable((observer:any) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.helper.setAppState('user',user);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Login Successful.',
        context:{params:{}}
      });
      observer.complete()
    });
    return obs;
  }
}

