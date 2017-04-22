import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../index';

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

  public workQueue: ReplaySubject<any> = new ReplaySubject();

  public routines: {} = {
    process_every_minute: new ProcessRoutine(
      'process_every_minute',
      'The Process Used to Control the Automated Tasks'
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

    // Special Binding for Processing Loop
    this.message.getProcessQueue().subscribe(
      processRoutine => {
        let pr: any;
        // Run Process Loop
        processRoutine.queueTasks().subscribe(
          null,
          null,
          () => {
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
        message: '',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

}
