import { Component, Input } from '@angular/core';
import { InviteService, Invite } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-list',
  templateUrl: 'invite-list.component.html',
  // providers: [ InviteService ]
})

export class InviteListComponent {

  errorMessage: string = '';

  /**
   *
   * @param 
   */
  constructor(
      // public service: InviteService
  ) {}

}
