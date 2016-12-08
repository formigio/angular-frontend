import { Component, OnInit } from '@angular/core';
import { TeamListComponent } from '../team/index';
import { UserService } from '../user/index';

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
   * UserService.
   *
   * @param {UserService} auth - The injected UserService.
   */
  constructor(
    public auth: UserService
  ) {}

  /**
   * Enfore Authentication OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
