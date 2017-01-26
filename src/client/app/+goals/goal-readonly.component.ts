import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../core/index';
import { GoalViewComponent } from '../goal/index';
import { TaskListComponent } from '../task/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-page',
  directives: [ GoalViewComponent, TaskListComponent ],
  templateUrl: 'goal-readonly.component.html'
})

export class GoalReadonlyComponent implements OnInit {

  id: string;
  hash: string;

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    protected auth: UserService,
    protected route: ActivatedRoute,
    protected message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.hash = params['hash'];
    });
  }
}
