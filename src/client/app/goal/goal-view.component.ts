import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalService, Goal } from './index';
import { MessageService } from '../core/index';
import { HelperService } from '../shared/index';

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
  goal: Goal = {
    guid: '',
    goal: '',
    accomplished: 'false'
  };

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
      goal => this.goal = <Goal>goal
    );
    this.route.params.subscribe(params => {
      this.message.startProcess('goal_view',params);
    });
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(goal:Goal): boolean {
    this.message.startProcess('goal_delete',{goal:goal.guid});
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  accomplishGoal(goal:Goal): boolean {
    goal.accomplished = 'true';
    this.service.put(goal)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => console.log('Goal Successfully saved.')
      );
    return false;
  }

}
