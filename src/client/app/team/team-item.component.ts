import { Component, Input, OnInit } from '@angular/core';
import { TeamService, Team } from './index';
import { MessageService, HelperService } from '../core/index';

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

export class TeamItemComponent implements OnInit {

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

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    if(!this.team.uuid) {
      this.message.startProcess('team_create',{team:this.team});
    }
  }

  makeEditable() {
    this.state = 'edit';
  }

  persistTeam() {
    this.state='view';
    this.message.startProcess('team_save',{team:this.team});
    return false;
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTeam(team:Team) {
    this.message.startProcess('team_delete',{team:team});
    return false;
  }

  navigateTo(team:Team) {
    this.message.startProcess('navigate_to',{navigate_to:'team/' + team.uuid});
  }
}
