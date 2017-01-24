import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessRoutine, ProcessTask, WorkerComponent } from '../../core/index';

/**
 * This class represents the lazy loaded RouteWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'route-worker',
  template: `<div></div>`,
  providers: [ ]
})
export class RouteWorkerComponent implements OnInit, WorkerComponent {

  public routines: {} = {
    navigate_to: new ProcessRoutine(
      'navigate_to',
      'Navigate to a Route',
      {params:{}},
      ''
    )
  };

  public tasks: {} = {
      navigate_to_init: new ProcessTask(
          'navigate',
          'navigate_to',
          'Navigate to a Route',
          'navigateTo',
          {navigate_to:'string'}
      ),
      remove_goal_complete: new ProcessTask(
          'navigate',
          'remove_goal_complete',
          'Navigate to Goals after Goal Delete',
          'navigateTo',
          {navigate_to:'string'}
      ),
      store_user_complete: new ProcessTask(
          'navigate',
          'store_user_complete',
          'Navigate to Home after Login',
          'navigateTo',
          {navigate_to:'string'}
      ),
      register_user_complete: new ProcessTask(
          'navigate',
          'register_user_complete',
          'Navigate to Login after Register',
          'navigateTo',
          {navigate_to:'string'}
      ),
      store_google_user_complete: new ProcessTask(
          'navigate',
          'store_google_user_complete',
          'Navigate after Google Login',
          'navigateTo',
          {navigate_to:'string'}
      ),
      test_user_auth_error: new ProcessTask(
          'navigate',
          'test_user_auth_error',
          'Navigate after Auth Test Fails',
          'navigateTo',
          {navigate_to:'string'}
      )
      // ,
      // link_invite_error: new ProcessTask(
      //     'navigate',
      //     'test_user_auth_error',
      //     'Navigate after Auth Test Fails',
      //     'navigateTo',
      //     {navigate_to:'string'}
      // )
  };

  constructor(
    public router: Router,
    public message: MessageService
  ) {}

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

  public navigateTo(control_uuid: string, params: any): Observable<any> {
    let navigate_to: string = params.navigate_to;
    let obs = new Observable((observer:any) => {
        this.router.navigate([navigate_to]);
      observer.next({control_uuid: control_uuid, outcome: 'success', message:'Nagivated.',context:{params:{}}});
      observer.complete();
    });
    return obs;
  }

}
