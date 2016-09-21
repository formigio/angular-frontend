import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoalListService, Goal, GoalItemComponent } from '../shared/index';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  directives: [ GoalItemComponent ],
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  providers: [ GoalListService ]
})

export class HomeComponent implements OnInit {

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
    public goalListService: GoalListService,
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
    this.goalListService.get()
                     .subscribe(
                       goals => this.goals = goals,
                       error =>  this.errorMessage = <any>error
                       );
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addGoal(): boolean {
    let guid = Math.random().toString().split('.').pop();
    this.goalListService.post({goal:this.newGoal,accomplished:this.newAccomplished,guid:guid})
      .subscribe(
        response => this.successObject,
        error => this.errorMessage = <any>error,
        () => this.router.navigate(['/goal/' + guid])
      );
    this.goals.push({guid:guid,goal:this.newGoal,accomplished:this.newAccomplished});
    this.newGoal = '';
    this.newAccomplished = 'false';
    return false;
  }

}
