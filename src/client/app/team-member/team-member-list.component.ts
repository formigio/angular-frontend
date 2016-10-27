import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamMemberService, TeamMember, TeamMemberItemComponent } from './index';
import { MessageService } from '../core/index';
import { HelperService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-member-list',
  directives: [ TeamMemberItemComponent ],
  templateUrl: 'team-member-list.component.html',
  providers: [ TeamMemberService ]
})

export class TeamMemberListComponent implements OnInit {

  members: TeamMember[] = [];

  member: TeamMember = {
    team_uuid: '',
    user_uuid: '',
    user_email: ''
  };

  team: string; // Team UUID from URL

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: TeamMemberService,
    public message: MessageService,
    public helper: HelperService,
    public route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamMemberService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription()
            .subscribe(
                members => this.members = members
            );
    this.route.params.subscribe(params => {
      this.team = params['uuid'];
      this.refreshTeamMembers();
    });
  }

  refreshTeamMembers() {
    this.message.startProcess('teammember_fetch_team_members',{team:this.team});
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTeamMember(): boolean {
    let newMember: TeamMember = JSON.parse(JSON.stringify(this.member));
    newMember.team_uuid = this.team;
    this.members.push(newMember);
    this.helper.sortBy(this.members,'user_email');
    this.message.startProcess('teammember_add',{team_uuid:this.team,user_email:newMember.user_email});
    return false;
  }

}
