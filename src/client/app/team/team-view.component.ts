import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { TeamService, Team } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-view',
  directives: [ ],
  templateUrl: 'team-view.component.html',
  providers: [ TeamService ]
})

export class TeamViewComponent implements OnInit {

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
    public route: ActivatedRoute,
    public service: TeamService,
    public helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getItemSubscription().subscribe(team => {
      this.team = <Team>team;
    });
    this.route.params.subscribe(params => {
      this.message.startProcess('team_view',params);
    });
  }

}
