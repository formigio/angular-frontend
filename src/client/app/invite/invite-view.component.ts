import { Component, Input, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
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

  @Input() uuid:string;

  invite: Invite = {
    uuid: '',
    entity: '',
    entityType: '',
    status: '',
    invitee: '',
    inviter: '',
    changed: false
  };

  /**
   *
   * @param
   */
  constructor(
      public service: InviteService,
      public message: MessageService,
      public helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'InviteService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(
      invite => this.invite = <Invite>invite
    );
    this.message.startProcess('invite_view',{uuid:this.uuid});
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
    let href = '/invite/' + this.invite.uuid + '/' + this.invite.entityType + '/'
        + this.invite.entity;
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
