import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

import { GoalService, Goal } from './index';

import { HelperService, MessageService } from '../shared/index';
import { ProcessService } from '../core/index';

/**
 * This class represents the lazy loaded GoalViewComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  templateUrl: 'goal-view.component.html',
  providers: [ GoalService, HelperService ]
})

export class GoalViewComponent implements OnInit {

  @Input() editable:boolean;

  errorMessage: string;
  currentResponse: {};
  goal: Goal;

  private sub: Subscription;

  /**
   * Creates an instance of the GoalViewComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected process: ProcessService,
    protected service: GoalService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected message: MessageService,
    protected helper: HelperService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       let id = params['guid'];
       this.service.get(id)
                      .subscribe(
                        goal => this.goal = <Goal>goal,
                        error =>  this.errorMessage = <any>error,
                        () => console.log('Goal Loaded')
                        );

     });
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(goal:Goal): boolean {

    this.process.initProcess('goal_delete',{goal:goal.guid});

    // if(this.tasks.length === 0 && this.invites.length === 0) {
      // this.service.delete(goal.guid)
      //   .subscribe(
      //     response => this.currentResponse,
      //     error => this.errorMessage = <any>error,
      //     () => this.router.navigate(['/goals'])
      //   );
    // }
    //  else {
    //   this.tasks.forEach((task) => this.deleteTask(task));
    //   this.invites.forEach((invite) => this.deleteInvite(invite));
    // }

    return false;
  }

  goalHasChildren(): boolean {
    // return this.tasks.length > 0 || this.invites.length > 0;
    return true;
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
