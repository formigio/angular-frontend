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

  @Input() id:string;

  invite: Invite = {
    id:'',
    entity: '',
    entity_id: '',
    invitee_name: '',
    invitee_worker_id: '',
    inviter_name: '',
    inviter_worker_id: '',
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
    this.message.startProcess('invite_view',{id:this.id});
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
    let href = '/invite/' + this.invite.id + '/' + this.invite.entity + '/'
        + this.invite.entity_id;
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

  acceptInvite() {
    this.message.startProcess('invite_accept',{invite:this.invite});
  }

}
