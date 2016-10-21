import { Component, OnInit } from '@angular/core';
import { TeamViewComponent } from '../team/index';
import { GoalListComponent } from '../goal/index';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded TeamPageComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-page',
  directives: [ TeamViewComponent, GoalListComponent ],
  templateUrl: 'team-page.component.html'
})

export class TeamPageComponent implements OnInit {

  /**
   * Creates an instance of the TeamPageComponent with the injected
   * AuthenticationService.
   *
   * @param {AuthenticationService} auth - The injected AuthenticationService.
   */
  constructor(
    public auth: AuthenticationService
  ) {}

  /**
   * Enfore Authentication OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
