import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService, Team, TeamItemComponent } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-list',
  directives: [ TeamItemComponent ],
  templateUrl: 'team-list.component.html',
  providers: [ TeamService ]
})

export class TeamListComponent implements OnInit {

  teams: Team[] = [];

  team: Team = {
    uuid: '',
    title: '',
    identity: '',
    changed: false
  };

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: TeamService,
    public message: MessageService,
    public helper: HelperService,
    public router: Router
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      teams => {
        let newteams:Team[] = [];
        let allteams:Team[] = teams;
        allteams.forEach((team) => {
          if(team.uuid) {
            newteams.push(team);
          }
        });
        this.teams = newteams;
      }
    );
    this.refreshTeams();
  }

  refreshTeams() {
    this.message.startProcess('team_fetch_user_teams',{});
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTeam(): boolean {
    // this.team.uuid = Math.random().toString().split('.').pop();
    this.team.uuid = '';
    this.team.changed = true;
    let newTeam: Team = JSON.parse(JSON.stringify(this.team));
    this.teams.push(newTeam);
    this.helper.sortBy(this.teams,'title');
    this.team.title = '';
    return false;
  }

}
