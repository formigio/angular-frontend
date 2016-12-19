import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { InviteService, Invite } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-item',
  templateUrl: 'invite-item.component.html',
  providers: [ InviteService ]
})

export class InviteItemComponent implements OnInit {

  @Input() invite:Invite;

  /**
   *
   * @param
   */
  constructor(
      public service: InviteService,
      public message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    if(!this.invite.uuid) {
      this.message.startProcess('invite_create',{invite:this.invite});
    }
  }

  /**
   * Deletes an invite
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteInvite(invite:Invite): boolean {
    invite.changed = true;
    this.message.startProcess('invite_delete',{invite:invite});
    return false;
  }

  copyLink() {
    window.prompt('Copy to clipboard: Ctrl+C, Enter', 'https://proto.formigio.com/goal/'
      + this.invite.goal + '/invite/' + this.invite.uuid);
  }
}
