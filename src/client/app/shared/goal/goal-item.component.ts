import { Component, Input } from '@angular/core';
import { GoalListService, Goal } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-item',
  templateUrl: 'goal-item.component.html',
  providers: [ GoalListService ]
})

export class GoalItemComponent {

  @Input() goal:Goal;

  errorMessage: string = '';

  /**
   *
   * @param 
   */
  constructor(
      public goalListService: GoalListService
  ) {}

  /**
   * Returns whether or not a goal is accomplished.
   * @return {boolean}
   */
  isAccomplished(goal: Goal): boolean {
    let acc = false;
    if(goal.accomplished==='true') {
      acc = true;
    }
    return acc;
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(guid: string): boolean {
    this.goalListService.delete(guid)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  putGoal(goal:Goal): boolean {
    this.goalListService.put(goal)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  accomplishGoal(goal:Goal): boolean {
    goal.accomplished = 'true';
    this.goalListService.put(goal)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }


}
