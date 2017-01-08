import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { InviteService, Invite } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-view',
  templateUrl: 'invite-view.component.html',
  providers: [ InviteService ]
})

export class InviteViewComponent implements OnInit {

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
    let href = '/invite/' + this.invite.uuid + '/' + this.invite.entity_type + '/'
        + this.invite.entity_uuid;
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

}
