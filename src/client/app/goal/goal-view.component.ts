import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalService, Goal, GoalStruct } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded GoalViewComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  templateUrl: 'goal-view.component.html',
  providers: [ GoalService ]
})
export class GoalViewComponent implements OnInit {

  @Input() editable:boolean;

  errorMessage: string;
  currentResponse: {};
  goal: Goal = GoalStruct;
  fullDescription: string = '';
  showForm: boolean = false;

  /**
   * Creates an instance of the GoalViewComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected service: GoalService,
    protected route: ActivatedRoute,
    protected message: MessageService,
    protected helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      goal => {
        this.goal = <Goal>goal;
        this.setDescription();
      }
    );
    this.route.params.subscribe(params => {
      this.message.startProcess('goal_view',params);
    });
  }

  setDescription() {
    if(this.goal.description === null || this.goal.description === '') {
      this.fullDescription = '';
    } else {
      let parts = this.goal.description.split('\n');
      this.fullDescription = parts.join('<br>');
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
  deleteGoal(goal:Goal): boolean {
    this.message.startProcess('goal_delete',{goal:goal.id});
    return false;
  }

  persistGoal() {
    this.showForm = false;
    this.goal.changed = true;
    this.message.startProcess('goal_save',{goal:this.goal});
  }

  accomplish() {
    this.goal.changed = true;
    this.goal.accomplished = true;
    this.message.startProcess('goal_save',{goal:this.goal});
  }

  saveTemplate() {
    this.goal.changed = true;
    this.message.startProcess('goal_save_template_from_goal',{goal:this.goal.id,goal_data:this.goal});
  }

  navigateToTeam(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/team/' + this.goal.team_id});
    return false;
  }

  navigateToTemplate(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/goal-template/' + this.goal.template_id});
    return false;
  }

  navigateToTeams(): boolean {
    this.message.startProcess('navigate_to',{navigate_to:'/teams/'});
    return false;
  }

}
