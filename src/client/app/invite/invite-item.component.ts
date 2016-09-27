import { Component, Input } from '@angular/core';
import { InviteService, Invite } from './index';
import { Goal } from '../goal/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-item',
  templateUrl: 'invite-item.component.html',
  providers: [ InviteService ]
})

export class InviteItemComponent {

  @Input() invite:Invite;

  goal: Goal;
  invites: Invite[] = [];
  currentResponse: any;

  errorMessage: string = '';

  /**
   *
   * @param 
   */
  constructor(
      public service: InviteService
  ) {}

  /**
   * Deletes an invite
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteInvite(invite:Invite): boolean {
    this.service.delete(invite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => invite.uuid = ''
      );
    return false;
  }

}
