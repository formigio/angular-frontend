import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { GoalService, Goal, GoalItemComponent, GoalStruct } from './index';

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
  activeGoals: Goal[] = [];
  accomplishCount: number;
  goal: Goal = GoalStruct;
  team: string = '';
  loading:boolean = true;
  showAccomplished:boolean = false;

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
        this.loading = false;
        this.goals = <Goal[]>goals;
        this.processGoals();
      }
    );
    this.route.params.subscribe(params => {
      this.team = params['uuid'];
      this.refreshGoals();
    });
  }

  processGoals() {
    this.accomplishCount = 0;
    this.activeGoals = [];
    let newgoals:Goal[] = [];
    let allgoals:Goal[] = this.goals;
    allgoals.forEach((goal) => {
      if(goal.title) {
        newgoals.push(goal);
      }
      if(!goal.accomplished || this.showAccomplished === true) {
        this.activeGoals.push(goal);
      }
      if(goal.accomplished) {
        this.accomplishCount++;
      }
    });
    this.goals = newgoals;
  }

  refreshGoals() {
    this.loading = true;
    this.goals = [];
    this.message.startProcess('load_goal_list',{team:this.team});
  }

  toggleAccomplished() {
    if(this.showAccomplished) {
      this.showAccomplished = false;
    } else {
      this.showAccomplished = true;
    }
    this.processGoals();
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addGoal(): boolean {
    this.goal.id = '';
    this.goal.changed = true;
    this.goal.team_id = this.team;
    let newGoal: Goal = JSON.parse(JSON.stringify(this.goal));
    this.goals.push(newGoal);
    this.activeGoals.push(newGoal);
    this.helper.sortBy(this.goals,'title');
    this.goal.title = '';
    this.goal.description = '';
    return false;
  }

}
