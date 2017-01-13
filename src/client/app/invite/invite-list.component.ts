import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { Invite, InviteService } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'invite-list',
  templateUrl: 'invite-list.component.html',
  providers: [ InviteService ]
})

export class InviteListComponent implements OnInit {

  @Input() entity_type:string;
  @Input() entity_uuid:string;

  invites: Invite[] = [];
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
    protected message: MessageService,
    protected helper: HelperService,
    protected service: InviteService,
    protected route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'InviteService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      invites => {
        let newinvites:Invite[] = [];
        let allinvites:Invite[] = invites;
        allinvites.forEach((invite) => {
          if(invite.uuid) {
            newinvites.push(invite);
          }
        });
        this.invites = newinvites;
      }
    );
    // this.route.params.subscribe(params => {
    //   this.goal = params['goal_uuid'];
    this.refreshInvites();
    // });
  }

  refreshInvites() {
    this.message.startProcess('invite_fetch',{
      entity_type:this.entity_type,
      entity_uuid:this.entity_uuid
    });
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let newInvite: Invite = JSON.parse(JSON.stringify(this.invite));
    newInvite.entityType = this.entity_type;
    newInvite.entity = this.entity_uuid;
    newInvite.status = 'pending';
    newInvite.changed = true;
    this.invites.push(newInvite);
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
