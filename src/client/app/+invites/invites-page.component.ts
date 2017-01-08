import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded TeamPageComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invites-page',
  directives: [ ],
  templateUrl: 'invites-page.component.html'
})

export class InvitesPageComponent implements OnInit {

  /**
   * Creates an instance of the TeamPageComponent with the injected
   * AuthenticationService.
   *
   * @param {AuthenticationService} auth - The injected AuthenticationService.
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
