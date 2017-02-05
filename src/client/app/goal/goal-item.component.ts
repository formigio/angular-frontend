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
  showFullDescription: boolean = false;
  fullDescription: string = '';

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
    if(!this.goal.id) {
      this.message.startProcess('create_goal',{goal:this.goal,navigate_to:'/goal/' + this.goal.id});
    }
    this.setDescription();
  }

  edit() {
    this.state = 'edit';
  }

  cancel() {
    this.state = 'view';
  }

  persistGoal() {
    this.state='view';
    this.goal.changed = true;
    this.message.startProcess('goal_save',{goal:this.goal});
  }

  toggleFullDescription() {
    if(this.showFullDescription === false) {
      this.showFullDescription = true;
    } else {
      this.showFullDescription = false;
    }
    this.setDescription();
  }

  setDescription() {
    if(this.goal.description === null || this.goal.description === '') {
      this.fullDescription = '';
    } else {
      let parts = this.goal.description.split('\n');
      if(this.showFullDescription) {
        this.fullDescription = parts.join('<br>');
      } else {
        this.fullDescription = parts.shift();
      }
    }
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(goal:Goal): boolean {
    this.goal.changed = true;
    this.message.startProcess('goal_delete',{goal:goal.id});
    return false;
  }

  navigateTo(goal:Goal) {
    this.router.navigate(['/goal/',goal.id]);
  }

}
