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

  statusMessage(): string {
    if(this.invite.status === ''){
      return '';
    } else if(this.invite.status === 'rejected') {
      return 'Email didn\'t send (Rejected from Email Sender)';
    } else if(this.invite.status === 'sent') {
      return 'Email Sent, just waiting for acceptance';
    } else if(this.invite.status === 'manual') {
      return 'You will need to copy the invite link and send to your teammate.';
    }
    return 'Status: ' + this.invite.status;
  }

  statusLabel(): string {
    if(this.invite.status === 'rejected') {
      return 'label label-danger';
    } else if(this.invite.status === 'manual') {
      return 'label label-warning';
    } else if(this.invite.status === 'pending') {
      return 'label label-warning';
    }
    return 'label label-success';
  }

}
