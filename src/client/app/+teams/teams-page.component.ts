import { Component, OnInit } from '@angular/core';
import { TeamListComponent } from '../team/index';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded TeamsPageComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'teams-page',
  directives: [ TeamListComponent ],
  templateUrl: 'teams-page.component.html'
})

export class TeamsPageComponent implements OnInit {

  /**
   * Creates an instance of the TeamsPageComponent with the injected
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
