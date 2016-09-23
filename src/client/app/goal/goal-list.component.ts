import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoalListService, Goal, GoalItemComponent } from './index';
import { AuthenticationService } from '../+login/index';
import { HelperService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-list',
  directives: [ GoalItemComponent ],
  templateUrl: 'goal-list.component.html',
  providers: [ GoalListService, HelperService ]
})

export class GoalListComponent implements OnInit {

  successObject: {};
  newGoal: string = '';
  newAccomplished: string = 'false';
  errorMessage: string;
  goals: Goal[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public auth: AuthenticationService,
    public service: GoalListService,
    public helper: HelperService,
    public router: Router
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
    this.getGoals();
  }

  /**
   * Handle the nameListService observable
   */
  getGoals() {
    this.service.get()
                     .subscribe(
                       goals => this.goals = goals,
                       error =>  this.errorMessage = <any>error,
                       () => this.helper.sortBy(this.goals,'goal')
                       );
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
