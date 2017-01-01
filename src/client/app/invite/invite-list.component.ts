import { Component, OnInit } from '@angular/core';
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

  invites: Invite[] = [];
  invite: Invite = {
    uuid: '',
    goal: '',
    changed: false
  };

  goal: string;

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
        if(invites===null){
          let invites:Invite[] = [];
        }
        let allinvites:Invite[] = invites;
        allinvites.forEach((invite) => {
          if(invite.goal) {
            newinvites.push(invite);
          }
        });
        this.invites = newinvites;
      }
    );
    this.route.params.subscribe(params => {
      this.goal = params['goal_uuid'];
      this.refreshInvites();
    });
  }

  refreshInvites() {
    this.message.startProcess('invite_fetch',{goal:this.goal});
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    // let uuid = Math.random().toString().split('.').pop();
    this.invite.goal = this.goal;
    let newInvite:Invite = {
      uuid: '',
      goal: this.goal,
      changed: true
    };
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
