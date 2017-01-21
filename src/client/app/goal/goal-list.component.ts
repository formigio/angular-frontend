import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { GoalService, Goal, GoalItemComponent } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-list',
  directives: [ GoalItemComponent ],
  templateUrl: 'goal-list.component.html',
  providers: [ GoalService ]
})

export class GoalListComponent implements OnInit {

  successObject: {};
  newGoal: string = '';
  newAccomplished: string = 'false';
  errorMessage: string;
  goals: Goal[] = [];
  goal: Goal = {
    id: '',
    title: '',
    team_id: '',
    changed: false
  };
  team: string = '';

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: GoalService,
    public helper: HelperService,
    public message: MessageService,
    public router: Router,
    public route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      goals => {
        this.goals = <Goal[]>goals;
        let newgoals:Goal[] = [];
        let allgoals:Goal[] = this.goals;
        allgoals.forEach((goal) => {
          if(goal.title) {
            newgoals.push(goal);
          }
        });
        this.goals = newgoals;
      }
    );
    this.route.params.subscribe(params => {
      this.team = params['uuid'];
      this.refreshGoals();
    });
  }

  refreshGoals() {
    this.message.startProcess('load_goal_list',{team:this.team});
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addGoal(): boolean {
    // let uuid = Math.random().toString().split('.').pop();
    this.goal.id = '';
    this.goal.changed = true;
    this.goal.team_id = this.team;
    let newGoal: Goal = JSON.parse(JSON.stringify(this.goal));
    this.goals.push(newGoal);
    this.helper.sortBy(this.goals,'title');
    this.goal.title = '';
    return false;
  }

}
