import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded InvitePageComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-page',
  directives: [ ],
  templateUrl: 'invite-page.component.html'
})

export class InvitePageComponent implements OnInit {

    uuid: string;

  /**
   * Creates an instance of the InvitePageComponent with the injected
   * AuthenticationService.
   *
   * @param {AuthenticationService} auth - The injected AuthenticationService.
   */
  constructor(
    public auth: UserService,
    public route: ActivatedRoute
  ) {}

  /**
   * Enfore Authentication OnInit
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uuid = params['uuid'];
    });
    this.auth.enforceAuthentication();
  }

}
