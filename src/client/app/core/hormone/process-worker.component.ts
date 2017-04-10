import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'process-worker',
  template: `<div></div>`,
  providers: [ ]
})
export class ProcessWorkerComponent implements OnInit, WorkerComponent {

  public routines: {} = {
    process_every_minute: new ProcessRoutine(
      'process_every_minute',
      'The Process Used to Control the Automated Tasks',
      new ProcessContext,
      [],
      ''
    )
  };

  public tasks: {} = {};

  constructor(
    public message: MessageService,
    public helper: HelperService
  ) { }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.message.getRegistrarQueue().subscribe(
      message => {
        if(Object.keys(message.tasks).length) {
          Object.values(message.tasks).forEach((task:ProcessTask) => {
            if(this.routines.hasOwnProperty(task.routine)) {
              let processRoutine = (<any>this.routines)[task.routine];
              processRoutine.tasks.push(task);
            }
          });
        }
      }
    );
    this.message.registerProcessTasks(this.tasks);

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

      // Run Timed Events
    //   setInterval(() => {
    //     this.message.startProcess('process_every_minute',{});
    //   }, 60000);
  }

  public endProcess(control_uuid: string, params: any): Observable<any> {
    let obs = new Observable((observer:any) => {
      observer.next({
        control_uuid: control_uuid,
        outcome: 'end',
        message: '',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

}
