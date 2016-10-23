import { Component, Input } from '@angular/core';
import { TeamService, Team } from './index';
import { MessageService } from '../core/index';
import { HelperService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-item',
  directives: [ ],
  templateUrl: 'team-item.component.html',
  providers: [ TeamService ]
})

export class TeamItemComponent {

  @Input() team: Team;

  state: string = 'view';
  errorMessage: string = '';

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: TeamService,
    public message: MessageService,
    public helper: HelperService
  ) {}


  makeEditable() {
    this.state = 'edit';
  }

  persistTeam() {
    this.state='view';
    this.saveTeam(this.team);
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTeam(team:Team) {
    this.message.startProcess('team_delete',{team:team});
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  saveTeam(team:Team) {
    this.message.startProcess('team_save',{team:team});
  }

  navigateTo(team:Team) {
    this.message.startProcess('navigate_to',{navigate_to:'team/' + team.uuid});
  }
}
