import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TeamService, Team, TeamItemComponent } from './index';
import { HelperService } from '../shared/index';

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
    isDeleted: false,
    isNew: true
  };

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public service: TeamService,
    public helper: HelperService,
    public router: Router
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription()
            .subscribe(
                teams => {
                this.teams = <Team[]>teams;
                }
            );
    this.service.publishTeams();
  }

  refreshTeams() {
    this.service.publishTeams();
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTeam(): boolean {
    this.team.uuid = Math.random().toString().split('.').pop();
    let newTeam: Team = JSON.parse(JSON.stringify(this.team));
    this.teams.push(newTeam);
    this.helper.sortBy(this.teams,'title');
    this.service.post(newTeam)
      .subscribe(
        null,
        null,
        () => {
          newTeam.isNew = false;
          this.team.title = '';
          this.team.uuid = '';
        }
      );
    return false;
  }

}
