import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GoalService, Goal } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-item',
  templateUrl: 'goal-item.component.html',
  providers: [ GoalService ]
})

export class GoalItemComponent {

  @Input() goal:Goal;

  errorMessage: string = '';
  successResponse: {};
  state: string = 'view';

  /**
   *
   * @param
   */
  constructor(
      public service: GoalService,
      public router: Router
  ) {}

  makeEditable() {
    this.state = 'edit';
  }

  persistGoal() {
    this.state='view';
    this.putGoal(this.goal);
  }

  // /**
  //  * Returns whether or not a goal is accomplished.
  //  * @return {boolean}
  //  */
  // isAccomplished(goal: Goal): boolean {
  //   let acc = false;
  //   if(goal.accomplished==='true') {
  //     acc = true;
  //   }
  //   return acc;
  // }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  putGoal(goal:Goal): boolean {
    this.service.put(goal)
      .subscribe(
        data => this.successResponse,
        error => this.errorMessage = <any>error,
        () => console.log('Goal Saved')
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  accomplishGoal(goal:Goal): boolean {
    // goal.accomplished = 'true';
    this.service.put(goal)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  navigateTo(goal:Goal) {
    this.router.navigate(['/goal/',goal.uuid]);
  }

}
