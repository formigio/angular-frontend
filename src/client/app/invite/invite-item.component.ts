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
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.invite.goal = this.goal.guid;
    let newInvite:Invite = {
      uuid: uuid,
      email: this.invite.email,
      goal: this.goal.guid
    };
    this.service.post(newInvite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.invites.push(newInvite)
      );
    this.invite.email = '';
    return false;
  }


  /**
   * Deletes an invite
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteInvite(invite:Invite): boolean {
    this.service.delete(invite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.removeInvite(invite)
      );
    return false;
  }

  removeInvite(remove:Invite): boolean {
    let newinvites:Invite[] = [];
    this.invites.forEach((invite) => {
      if(invite.uuid !== remove.uuid) {
        newinvites.push(invite);
      }
    });
    this.invites = newinvites;
    return false;
  }



}
