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

  @Input() entity:string;
  @Input() entity_id:string;

  addFormActive:boolean = false;

  invites: Invite[] = [];
  invite: Invite = {
    id:'',
    hash:'',
    entity: '',
    entity_id: '',
    invitee_name: '',
    invitee_worker_id: '',
    inviter_name: '',
    inviter_worker_id: '',
    status: '',
    changed: false
  };
  loading:boolean = false;
  validEmail:boolean = false;

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
    this.invite.entity = this.entity;
    this.invite.entity_id = this.entity_id;

  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      invites => {
        this.loading = false;
        let newinvites:Invite[] = [];
        let allinvites:Invite[] = invites;
        allinvites.forEach((invite) => {
          if(invite.id) {
            newinvites.push(invite);
          }
        });
        this.invites = newinvites;
      }
    );
    this.refreshInvites();
  }

  refreshInvites() {
    this.loading = true;
    this.invites = [];
    this.message.startProcess('invite_fetch',{
      entity:this.entity,
      entity_id:this.entity_id
    });
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let newInvite: Invite = JSON.parse(JSON.stringify(this.invite));
    newInvite.entity = this.entity;
    newInvite.entity_id = this.entity_id;
    newInvite.changed = true;
    this.invites.push(newInvite);
    this.invite.invitee_name = '';
    return false;
  }

  removeInvite(remove:Invite): boolean {
    let newinvites:Invite[] = [];
    this.invites.forEach((invite) => {
      if(invite.id !== remove.id) {
        newinvites.push(invite);
      }
    });
    this.invites = newinvites;
    return false;
  }

  enableAddForm() {
    this.addFormActive = true;
  }

  disableAddForm() {
    this.addFormActive = false;
  }

  isValidEmail():boolean {
    if(!this.invite.invitee_name) {
      return false;
    }
    return this.invite.invitee_name
      .match(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}\b/gi) !== null;
  }

  testEmail() {
    this.validEmail = this.isValidEmail();
  }
}
