import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamViewComponent } from '../team/index';
import { GoalListComponent } from '../goal/index';
import { GoalTemplateSearchListComponent } from '../goal-template/index';
import { TeamMemberListComponent } from '../team-member/index';
import { InviteListComponent } from '../invite/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded TeamPageComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-page',
  directives: [ TeamViewComponent, GoalListComponent, GoalTemplateSearchListComponent, TeamMemberListComponent, InviteListComponent ],
  templateUrl: 'team-page.component.html'
})

export class TeamPageComponent implements OnInit {

  team_uuid: string;

  /**
   * Creates an instance of the TeamPageComponent with the injected
   * AuthenticationService.
   *
   * @param {AuthenticationService} auth - The injected AuthenticationService.
   */
  constructor(
    public auth: UserService,
    public route: ActivatedRoute
  ) {}

  /**
   * Enfore Authentication OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
    this.route.params.subscribe(params => {
      this.team_uuid = params['uuid'];
    });

  }

}
