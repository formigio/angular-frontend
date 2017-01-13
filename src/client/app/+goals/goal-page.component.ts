import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalViewComponent } from '../goal/index';
import { TaskListComponent } from '../task/index';
import { InviteListComponent } from '../invite/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-page',
  directives: [ GoalViewComponent, TaskListComponent, InviteListComponent ],
  templateUrl: 'goal-page.component.html'
})

export class GoalPageComponent implements OnInit {

  goal_uuid: string;

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public auth: UserService,
    protected route: ActivatedRoute
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
    this.route.params.subscribe(params => {
      this.goal_uuid = params['goal_uuid'];
    });
  }

}
