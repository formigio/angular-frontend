import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Invite, InviteService } from './index';
import { Goal } from '../goal/index';

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
    goal: ''
  }

  goal: Goal = {
    accomplished: '',
    guid: '',
    goal: ''
  };

  private sub: Subscription;

  /**
   *
   * @param 
   */
  constructor(
      protected service: InviteService,
      protected route: ActivatedRoute
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if(this.goal.guid = params['guid']) {
        this.fetchInvites();
      }
     });
  }

  fetchInvites() {
    this.service.list(this.goal.guid)
                .subscribe(
                  invites => this.invites = <Invite[]>invites,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Invites are Fetched')
                  );
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.invite.goal = this.goal.guid;
    let newInvite:Invite = {
      uuid: uuid,
      email: this.invite.email,
      goal: this.goal.guid
    };
    this.service.post(newInvite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.invites.push(newInvite)
      );
    this.invite.email = '';
    return false;
  }


  /**
   * Deletes an invite
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteInvite(invite:Invite): boolean {
    this.service.delete(invite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.removeInvite(invite)
      );
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
