import { Component, OnInit } from '@angular/core';
import { GoalListComponent } from '../goal/index';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goals-page',
  directives: [ GoalListComponent ],
  templateUrl: 'goals-page.component.html'
})

export class GoalsPageComponent implements OnInit {

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public auth: AuthenticationService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
