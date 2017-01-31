import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessTask, WorkerComponent } from '../index';

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

  public routines: {} = {};

  public tasks: {} = {
      load_user_for_app_complete: new ProcessTask(
          'end_process',
          'load_user_for_app_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_user_for_app_error: new ProcessTask(
          'end_process',
          'load_user_for_app_error',
          'End Process',
          'endProcess',
          {}
      ),
      store_user_worker_complete: new ProcessTask(
          'end_process',
          'store_user_worker_complete',
          'End Process',
          'endProcess',
          {}
      ),
      user_logout_complete: new ProcessTask(
          'end_process',
          'user_logout_complete',
          'End Process',
          'endProcess',
          {}
      ),
      fetch_teams_complete: new ProcessTask(
          'end_process',
          'fetch_teams_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_commitments_complete: new ProcessTask(
          'end_process',
          'load_commitments_complete',
          'End Process',
          'endProcess',
          {}
      ),
      create_team_complete: new ProcessTask(
          'end_process',
          'create_team_complete',
          'End Process',
          'endProcess',
          {}
      ),
      save_team_complete: new ProcessTask(
          'end_process',
          'save_team_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_team_complete: new ProcessTask(
          'end_process',
          'delete_team_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_team_error: new ProcessTask(
          'end_process',
          'delete_team_error',
          'End Process',
          'endProcess',
          {}
      ),
      publish_invites_complete: new ProcessTask(
          'end_process',
          'publish_invites_complete',
          'End Process',
          'endProcess',
          {}
      ),
      create_invite_complete: new ProcessTask(
          'end_process',
          'create_invite_complete',
          'End Process',
          'endProcess',
          {}
      ),
      fetch_team_members_complete: new ProcessTask(
          'end_process',
          'fetch_team_members_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_team_goals_complete: new ProcessTask(
          'end_process',
          'load_team_goals_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_team_complete: new ProcessTask(
          'end_process',
          'load_team_complete',
          'End Process',
          'endProcess',
          {}
      ),
      create_goal_task_complete: new ProcessTask(
          'end_process',
          'create_goal_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_goal_task_complete: new ProcessTask(
          'end_process',
          'delete_goal_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      put_goal_task_complete: new ProcessTask(
          'end_process',
          'put_goal_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_invite_complete: new ProcessTask(
          'end_process',
          'delete_invite_complete',
          'End Process',
          'endProcess',
          {}
      ),
      navigate_complete: new ProcessTask(
          'end_process',
          'navigate_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_goal_complete: new ProcessTask(
          'end_process',
          'load_goal_complete',
          'End Process',
          'endProcess',
          {}
      ),
      publish_tasks_complete: new ProcessTask(
          'end_process',
          'publish_tasks_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_goal_task_error: new ProcessTask(
          'end_process',
          'delete_goal_task_error',
          'End Process',
          'endProcess',
          {}
      ),
      create_task_complete: new ProcessTask(
          'end_process',
          'create_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      save_task_complete: new ProcessTask(
          'end_process',
          'save_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_task_complete: new ProcessTask(
          'end_process',
          'delete_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_task_error: new ProcessTask(
          'end_process',
          'delete_task_error',
          'End Process',
          'endProcess',
          {}
      ),
      publish_task_complete: new ProcessTask(
          'end_process',
          'publish_task_complete',
          'End Process',
          'endProcess',
          {}
      ),
      load_commitments_after_task_save_complete: new ProcessTask(
          'end_process',
          'load_commitments_after_task_save_complete',
          'End Process',
          'endProcess',
          {}
      ),
      delete_commitment_complete: new ProcessTask(
          'end_process',
          'delete_commitment_complete',
          'End Process',
          'endProcess',
          {}
      ),
      get_user_for_fetch_teams_error: new ProcessTask(
          'end_process',
          'get_user_for_fetch_teams_error',
          'End Process',
          'endProcess',
          {}
      )
  };



  constructor(
    public message: MessageService,
    public helper: HelperService
  ) { }

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
