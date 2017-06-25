import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine,
  WorkerBaseComponent } from '../index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'process-worker',
  template: `<div></div>`,
  providers: [ ]
})
export class ProcessWorkerComponent extends WorkerBaseComponent implements OnInit {

  public workQueue: ReplaySubject<any> = new ReplaySubject();

  public routines: {} = {
    process_every_minute: new ProcessRoutine(
      'process_every_minute',
      'The Process Used to Control the Automated Tasks',
      () => { return true; }
    )
  };

  public tasks: {} = {};

  constructor(
    public message: MessageService,
    public helper: HelperService
  ) {
    super();
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.subscribe();

    // Special Binding for Processing Loop
    this.message.getProcessQueue().subscribe(
      processRoutine => {
        // Run Process Loop
        processRoutine.queueTasks().subscribe(
          null,
          null,
          () => {
            this.message.processPendingProcesses();
            // this.message.addStickyMessage('Routine Complete');
            // this.ref.tick();
          }
        );
      }
    );

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
        message: {},
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

}
