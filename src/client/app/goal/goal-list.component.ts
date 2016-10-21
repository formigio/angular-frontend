import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../core/index';
import { HelperService } from '../shared/index';
import { GoalService, Goal, GoalItemComponent } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-list',
  directives: [ GoalItemComponent ],
  templateUrl: 'goal-list.component.html',
  providers: [ GoalService, HelperService ]
})

export class GoalListComponent implements OnInit {

  successObject: {};
  newGoal: string = '';
  newAccomplished: string = 'false';
  errorMessage: string;
  goals: Goal[] = [];
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
      goals => this.goals = <Goal[]>goals
    );
    this.route.params.subscribe(params => {
      console.log('GoalList Route Params:');
      console.log(params);
      this.team = params['uuid'];
      this.service.publishGoals(this.team);
    });
  }

  refreshGoals() {
    this.service.publishGoals(this.team);
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addGoal(): boolean {
    let guid = Math.random().toString().split('.').pop();
    this.service.post({goal:this.newGoal,accomplished:this.newAccomplished,guid:guid})
      .subscribe(
        response => this.successObject,
        error => this.errorMessage = <any>error,
        () => this.router.navigate(['/goal/' + guid])
      );
    this.goals.push({guid:guid,goal:this.newGoal,accomplished:this.newAccomplished});
    this.helper.sortBy(this.goals,'goal');
    this.newGoal = '';
    this.newAccomplished = 'false';
    return false;
  }

}
