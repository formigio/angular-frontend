import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { GoalTemplateService, GoalTemplate, GoalTemplateItemComponent, GoalTemplateStruct } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-list',
  directives: [ GoalTemplateItemComponent ],
  templateUrl: 'goal-template-list.component.html',
  providers: [ GoalTemplateService ]
})

export class GoalTemplateListComponent implements OnInit {

  goalTemplates: GoalTemplate[] = [];
  goalTemplate: GoalTemplate = GoalTemplateStruct;
  team: string = '';
  loading: boolean = true;

  constructor(
    public service: GoalTemplateService,
    public helper: HelperService,
    public message: MessageService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalTemplateService');
  }

  ngOnInit() {
    this.service.getListSubscription().subscribe(
      goals => {
        this.loading = false;
        this.goalTemplates = <GoalTemplate[]>goals;
        this.processGoalTemplates();
      }
    );
    this.route.params.subscribe(params => {
      this.team = params['id'];
      this.refreshGoalTemplates();
    });
  }

  processGoalTemplates() {
    let newgoalTemplates:GoalTemplate[] = [];
    let allgoalTemplates:GoalTemplate[] = this.goalTemplates;
    allgoalTemplates.forEach((goalTemplate) => {
      if(goalTemplate.title) {
        newgoalTemplates.push(goalTemplate);
      }
    });
    this.goalTemplates = newgoalTemplates;
  }

  refreshGoalTemplates() {
    this.loading = true;
    this.message.startProcess('goal_template_load_list',{team:this.team});
  }

  addGoalTemplate(): boolean {
    this.goalTemplate.id = '';
    this.goalTemplate.changed = true;
    this.goalTemplate.team_id = this.team;
    let newGoalTemplate: GoalTemplate = JSON.parse(JSON.stringify(this.goalTemplate));
    this.goalTemplates.push(newGoalTemplate);
    this.helper.sortBy(this.goalTemplates,'title');
    this.goalTemplate.title = '';
    this.goalTemplate.documentation = '';
    return false;
  }

  navigateToTeam(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.team});
    return false;
  }

  navigateToTeams(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/teams/'});
    return false;
  }

}
