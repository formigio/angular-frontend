import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalTemplateService, GoalTemplate, GoalTemplateStruct } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded GoalViewComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-view',
  templateUrl: 'goal-template-view.component.html',
  providers: [ GoalTemplateService ]
})
export class GoalTemplateViewComponent implements OnInit {

  @Input() editable:boolean;

  errorMessage: string;
  currentResponse: {};
  goalTemplate: GoalTemplate = GoalTemplateStruct;
  fullDocumentation: string = '';
  showForm: boolean = false;

  /**
   * Creates an instance of the GoalViewComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalTemplateService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected service: GoalTemplateService,
    protected route: ActivatedRoute,
    protected message: MessageService,
    protected helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalTemplateService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      goalTemplate => {
        this.goalTemplate = <GoalTemplate>goalTemplate;
        this.setDocs();
      }
    );
    this.route.params.subscribe(params => {
      this.message.startProcess('goal_template_view',params);
    });
  }

  setDocs() {
    if(this.goalTemplate.documentation === null || this.goalTemplate.documentation === '') {
      this.fullDocumentation = '';
    } else {
      let parts = this.goalTemplate.documentation.split('\n');
      this.fullDocumentation = parts.join('<br>');
    }
  }

  edit() {
    this.showForm = true;
  }

  cancel() {
    this.showForm = false;
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoalTemplate(goalTemplate:GoalTemplate): boolean {
    this.message.startProcess('goal_template_delete',{id:goalTemplate.id});
    return false;
  }

  persistGoalTemplate() {
    this.showForm = false;
    this.goalTemplate.changed = true;
    this.message.startProcess('goal_template_save',{goalTemplate:this.goalTemplate});
  }

  navigateToTeam(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.goalTemplate.team_id});
    return false;
  }

  navigateToTeams(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/teams/'});
    return false;
  }

  navigateToTemplates(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.goalTemplate.team_id + '/goal-templates'});
    return false;
  }

}
