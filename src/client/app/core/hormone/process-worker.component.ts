import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine,
  ProcessContext, ProcessTask, ProcessTaskDef,
  ProcessTaskStruct, WorkerComponent } from '../index';

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

  public workQueue: ReplaySubject<any> = new ReplaySubject(1);

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
          Object.values(message.tasks).forEach((taskdef:ProcessTaskDef) => {
            let task: ProcessTask = JSON.parse(JSON.stringify(ProcessTaskStruct));
            task.identifier = taskdef.identifier;
            task.trigger = taskdef.trigger;
            task.routine = taskdef.routine;
            task.description = taskdef.description;
            task.method = taskdef.method;
            task.ready = taskdef.ready;
            task.params = taskdef.params;
            task.queue = this.workQueue;
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
        // Run Process Loop
        processRoutine.queueTasks();
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
