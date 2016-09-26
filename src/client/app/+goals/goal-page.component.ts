import { Component, OnInit } from '@angular/core';
import { GoalViewComponent } from '../goal/index';
import { TaskListComponent } from '../task/index';
import { InviteListComponent } from '../invite/index';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-page',
  directives: [ GoalViewComponent, TaskListComponent, InviteListComponent ],
  templateUrl: 'goal-page.component.html'
})

export class GoalPageComponent implements OnInit {

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
