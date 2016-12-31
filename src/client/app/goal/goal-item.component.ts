import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../core/index';
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

export class GoalItemComponent implements OnInit {

  @Input() goal:Goal;

  state: string = 'view';

  /**
   *
   * @param
   */
  constructor(
    public message: MessageService,
    public service: GoalService,
    public router: Router
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    if(!this.goal.guid) {
      this.message.startProcess('create_goal',{goal:this.goal,navigate_to:'/goal/' + this.goal.guid});
    }
  }

  makeEditable() {
    this.state = 'edit';
  }

  persistGoal() {
    this.state='view';
    this.message.startProcess('goal_save',{goal:this.goal});
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

  // /**
  //  * Puts the accomplished Goal Object to the Goal List Service
  //  * @return {boolean} false to prevent default form submit behavior to refresh the page.
  //  */
  // accomplishGoal(goal:Goal): boolean {
  //   // goal.accomplished = 'true';
  //   this.service.put(goal)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

  navigateTo(goal:Goal) {
    this.router.navigate(['/goal/',goal.guid]);
  }

}
