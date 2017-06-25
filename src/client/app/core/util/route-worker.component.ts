import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HelperService, MessageService, ProcessRoutine, ProcessTask,
  ProcessContext, WorkerBaseComponent } from '../index';

/**
 * This class represents the lazy loaded RouteWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'route-worker',
  template: `<div></div>`,
  providers: [ ]
})
export class RouteWorkerComponent extends WorkerBaseComponent implements OnInit {

  public routines: {} = {
    navigate_to: new ProcessRoutine(
      'navigate_to',
      'Navigate to a Route'
    )
  };

  public tasks: {} = {
      navigate_to_init: new ProcessTask(
          'navigate',
          'navigate_to',
          'navigate_to',
          'Navigate to a Route',
          'navigateTo',
          (context:ProcessContext) => {
            return true;
          },
          {navigate_to:'string'}
      ),
      delete_goal_task_complete: new ProcessTask(
          'navigate',
          'delete_goal_task_complete',
          'goal_delete',
          'Navigate to Goals after Goal Delete',
          'navigateTo',
          (context:ProcessContext) => {
            return context.hasSignal('delete_goal_task_complete');
          },
          {navigate_to:'string'}
      ),
      store_user_complete: new ProcessTask(
          'navigate',
          'store_user_complete',
          'user_login',
          'Navigate to Home after Login',
          'navigateTo',
          (context:ProcessContext) => {
            return context.hasSignal('store_user_complete');
          },
          {navigate_to:'string'}
      ),
      register_user_complete: new ProcessTask(
          'navigate',
          'register_user_complete',
          'user_register',
          'Navigate to Login after Register',
          'navigateTo',
          (context:ProcessContext) => {
            return context.hasSignal('register_user_complete');
          },
          {navigate_to:'string'}
      )
  };

  constructor(
    public helper: HelperService,
    public message: MessageService,
    public router: Router
  ) {
    super();
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.subscribe();
  }

  public navigateTo(control_uuid: string, params: any): Observable<any> {
    let navigate_to: string = params.navigate_to;
    let obs = new Observable((observer:any) => {
        this.router.navigate([navigate_to]);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:{
          message:'Nagivated.'
        },
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

}
