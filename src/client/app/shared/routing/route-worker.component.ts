import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, ProcessRoutine, ProcessTask,
  WorkerComponent, ProcessContext, ProcessTaskRegistration } from '../../core/index';

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

  public workQueue: ReplaySubject<any> = new ReplaySubject(1);

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
      remove_goal_complete: new ProcessTask(
          'navigate',
          'remove_goal_complete',
          'goal_delete',
          'Navigate to Goals after Goal Delete',
          'navigateTo',
          (context:ProcessContext) => {
            return context.hasSignal('remove_goal_complete');
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
    public router: Router,
    public message: MessageService
  ) {}


  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.message.getRegistrarQueue().subscribe(
      taskRegistration => {
        if(Object.keys(taskRegistration.tasks).length) {
          Object.values(taskRegistration.tasks).forEach((task:ProcessTask) => {
            task.queue = taskRegistration.queue;
            if(this.routines.hasOwnProperty(task.routine)) {
              let processRoutine = (<any>this.routines)[task.routine];
              processRoutine.tasks.push(task);
            }
          });
        }
      }
    );
    this.message.registerProcessTasks(new ProcessTaskRegistration(this.tasks,this.workQueue));

    // Subscribe to Process Queue
    // Process Tasks based on messages received
    if(Object.keys(this.tasks).length > 0) {
      this.workQueue.subscribe(
        workMessage => {
          // Process Signals
          workMessage.executeMethod(this);
        }
      );
    }
    if(Object.keys(this.routines).length > 0) {
      this.message.getProcessInitQueue().subscribe(
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
