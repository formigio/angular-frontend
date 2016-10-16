import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, ProcessTask, WorkerComponent } from '../../core/index';
import { HelperService } from '../index';

/**
 * This class represents the lazy loaded RouteWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'route-worker',
  template: `<div>Route Worker</div>`,
  providers: [ ]
})
export class RouteWorkerComponent implements OnInit, WorkerComponent {

  public routines: {} = {};

  public tasks: {} = {
      remove_goal_complete: new ProcessTask(
          'navigate',
          'remove_goal_complete',
          'Navigate to Goals after Goal Delete',
          'navigateTo',
          {navigate_to:'string'}
      )
  };

  constructor(
    public message: MessageService,
    protected helper: HelperService
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
        this.helper.router.navigate([navigate_to]);
      observer.next({control_uuid: control_uuid, outcome: 'success', message:'Nagivated.',context:{params:{}}});
      observer.complete();
    });
    return obs;
  }

}
