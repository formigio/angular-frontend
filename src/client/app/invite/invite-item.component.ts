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
    if(!this.invite.id) {
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

  getInviteLink(full:boolean):string {
    let href = '/invite/' + this.invite.hash;
      if(full) {
        return window.location.origin + href;
      }
    return href;
  }

  copyLink() {
    window.prompt(
      'Copy to clipboard: Ctrl+C, Enter',
      this.getInviteLink(true)
    );
  }

  claimed(): string {
    if(String(this.invite.invitee_worker_id) === '0') {
      return '(unclaimed)';
    } else {
      return '(linked)';
    }
  }

}
