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
    identity: ''
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

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTeam(): boolean {
    this.team.uuid = Math.random().toString().split('.').pop();
    this.service.post(this.team)
      .subscribe(
        null,
        null,
        () => this.service.publishTeams()
      );
    this.teams.push(this.team);
    this.helper.sortBy(this.teams,'title');
    this.team.title = '';
    return false;
  }

}
