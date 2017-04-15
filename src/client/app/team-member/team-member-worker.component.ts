import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine, ProcessContext,
  ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
import { TeamMember, TeamMemberService } from './index';
import { User } from '../user/index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-member-worker',
  template: `<div></div>`,
  providers: [ TeamMemberService ]
})
export class TeamMemberWorkerComponent implements OnInit, WorkerComponent {

    public workQueue: ReplaySubject<any> = new ReplaySubject(1);

    public routines: {} = {
        teammember_fetch_team_members: new ProcessRoutine(
            'teammember_fetch',
            'The Process Used to Control the Fetching of TeamMembers'
        )
    };

    public tasks: {} = {
        get_user_for_load_teammembers_complete: new ProcessTask(
            'fetch_team_members',
            'get_user_for_load_teammembers_complete',
            'teammember_fetch',
            'Fetch Team Members',
            'fetchTeamMembers',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_delete_task_complete');
            },
            {team:'Team',user:'User'}
        )
    };

  constructor(
    protected service: TeamMemberService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamMemberService');
  }

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

  public fetchTeamMembers(control_uuid: string, params: any): Observable<any> {
    let team: string = params.team;
    let user: User = params.user;
    let loadedMembers: TeamMember[];
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(team).then(
        response => {
          loadedMembers = response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Members loaded successfully.',
            context:{params:{team_members_loaded:true}}
          });
          this.service.publishTeamMembers(loadedMembers);
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Teams load failed: ' + error,
            context:{params:{}}
        })
      );
    });
    return obs;
  }

}
