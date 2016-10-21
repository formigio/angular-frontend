import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamService, Team } from './index';
import { HelperService } from '../shared/index';
import { MessageService } from '../core/index';

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
