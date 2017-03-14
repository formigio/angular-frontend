import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService, HelperService, ProcessRoutine, ProcessContext, ProcessTask, WorkerComponent } from '../core/index';
import { User } from '../user/index';
import { GoalTemplate, GoalTemplateService } from './index';

/**
 * This class represents the lazy loaded GoalWorkerComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-worker',
  template: `<div></div>`,
  providers: [ GoalTemplateService ]
})
export class GoalTemplateWorkerComponent implements OnInit, WorkerComponent {

  public routines: {} = {
      goal_template_delete: new ProcessRoutine(
          'goal_template_delete',
          'The Process Used to Control the Deletion of Goals',
          new ProcessContext,
          ''
      ),
      goal_template_view: new ProcessRoutine(
          'goal_template_view',
          'The Process Used to Control the Viewing of Goals',
          new ProcessContext,
          ''
      ),
      goal_template_load_list: new ProcessRoutine(
          'goal_template_load_list',
          'The Process Used to Control the Viewing of Goals',
          new ProcessContext,
          ''
      ),
      goal_template_create: new ProcessRoutine(
          'goal_template_create',
          'The Process Used to Control the Creating of Goals',
          new ProcessContext,
          ''
      ),
      goal_template_save: new ProcessRoutine(
          'goal_template_save',
          'The Process Used to Control the Saving of Goals',
          new ProcessContext,
          ''
      ),
      goal_template_to_goal: new ProcessRoutine(
          'goal_template_to_goal',
          'The Process Used to Control the Converting Goal Template to Goal',
          new ProcessContext,
          ''
      ),
      goal_template_search: new ProcessRoutine(
          'goal_template_search',
          'The Process Used to Control the Searching for Goals',
          new ProcessContext,
          ''
      )
  };

  public tasks: {} = {
      get_user_for_goal_template_search_complete: new ProcessTask(
          'search_for_goal_template',
          'get_user_for_goal_template_search_complete',
          'Search Goal Template',
          'searchGoalTemplates',
          {term:'string',user:'User',team:'Team'}
      ),
      get_user_for_goal_template_view_complete: new ProcessTask(
          'load_goal_template',
          'get_user_for_goal_template_view_complete',
          'Load Goal Template',
          'loadGoalTemplate',
          {id:'string',user:'User'}
      ),
      get_user_for_goal_template_load_list_complete: new ProcessTask(
          'load_team_goal_templates',
          'get_user_for_goal_template_load_list_complete',
          'Load Goal Templates',
          'loadGoalTemplates',
          {team:'string',user:'User'}
      ),
      get_user_for_goal_template_create_complete: new ProcessTask(
          'create_goal_template',
          'get_user_for_goal_template_create_complete',
          'Create Goal Tempalte',
          'createGoalTemplate',
          {goalTemplate:'GoalTemplate',user:'User'}
      ),
      get_user_for_goal_template_save_complete: new ProcessTask(
          'save_goal_template',
          'get_user_for_goal_template_save_complete',
          'Save Goal Template',
          'saveGoalTemplate',
          {goalTemplate:'GoalTemplate',user:'User'}
      ),
      get_user_for_goal_template_delete_complete: new ProcessTask(
          'delete_goal_template',
          'get_user_for_goal_template_delete_complete',
          'Delete Goal Template',
          'deleteGoalTemplate',
          {id:'string',user:'User'}
      )
  };

  constructor(
    public service: GoalTemplateService,
    public message: MessageService,
    public helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalTemplateService');
  }

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

  public loadGoalTemplate(control_uuid: string, params: any): Observable<any> {
    let id: string = params.id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.get(id).then(
        response => {
          this.service.publishGoalTemplate(response.data);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Template Loaded.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Template Load Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public searchGoalTemplates(control_uuid: string, params: any): Observable<any> {
    let term: string = params.term;
    let team: string = params.team;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.search(team,term).then(
        response => {
          let goalTemplates = <GoalTemplate[]>response.data;
          this.service.publishGoalTemplates(goalTemplates);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message: 'Goal Template loaded successfully.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message: 'Goals Template Load Failed.',
          context:{params:{}}
        })
      );
    });
    return obs;
  }

  public loadGoalTemplates(control_uuid: string, params: any): Observable<any> {
    let team: string = params.team;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.list(team).then(
        response => {
          let goalTemplates = <GoalTemplate[]>response.data;
          this.service.publishGoalTemplates(goalTemplates);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message: 'Goal Template loaded successfully.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message: 'Goals Template Load Failed.',
          context:{params:{}}
        })
      );
    });
    return obs;
  }

  public createGoalTemplate(control_uuid: string, params: any): Observable<any> {
    let goalTemplate: GoalTemplate = params.goalTemplate;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(goalTemplate).then(
        response => {
          goalTemplate = <GoalTemplate>response.data;
          this.service.addGoalTemplate(goalTemplate);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Template Saved Successfully.',
            context:{params:{goal:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public deleteGoalTemplate(control_uuid: string, params: any): Observable<any> {
    let id: string = params.id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(id).then(
        response => {
          this.service.removeGoalTemplate(id);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Template Remove Successfully.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Template Remove Failed. You can only delete empty Goal Templates.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public saveGoalTemplate(control_uuid: string, params: any): Observable<any> {
    let goalTemplate: GoalTemplate = params.goalTemplate;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(goalTemplate).then(
        response => {
          goalTemplate = <GoalTemplate>response.data;
          this.service.updateGoalTemplate(goalTemplate);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Goal Template Saved Successfully.',
            context:{params:{goalTemplate:response.data}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Goal Template Save Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

}
