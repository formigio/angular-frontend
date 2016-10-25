import { Component, Input } from '@angular/core';
import { TeamMemberService, TeamMember } from './index';
import { MessageService } from '../core/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-member-item',
  directives: [ ],
  templateUrl: 'team-member-item.component.html',
  providers: [ TeamMemberService ]
})

export class TeamMemberItemComponent {

  @Input() member: TeamMember;

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: TeamMemberService,
    public message: MessageService
  ) {}

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTeamMember(teammember:TeamMember) {
    this.message.startProcess('teammember_delete',{teammember:teammember});
    return false;
  }
}
