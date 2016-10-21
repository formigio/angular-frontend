import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { HelperService } from '../shared/index';

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

  errorMessage: string = '';
  invites: Invite[] = [];
  currentResponse: string;
  invite: Invite = {
    email: '',
    uuid: '',
    goal: '',
    deleted: false
  };

  goal: string;

  private sub: Subscription;

  /**
   *
   * @param
   */
  constructor(
      protected service: InviteService,
      protected route: ActivatedRoute,
      protected helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'InviteService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if(this.goal = params['uuid']) {
        this.service.getListSubscription()
                .subscribe(
                  invites => {
                    this.invites = <Invite[]>invites;
                  }
                );
        this.fetchInvites();
      }
     });
  }

  fetchInvites() {
    this.service.refreshInvites(this.goal);
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.invite.goal = this.goal;
    let newInvite:Invite = {
      uuid: uuid,
      email: this.invite.email,
      goal: this.goal,
      deleted: false
    };
    this.service.addInvite(newInvite);
    this.invite.email = '';
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
