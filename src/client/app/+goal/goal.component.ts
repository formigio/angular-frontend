import { Component, OnInit } from '@angular/core';
import { TaskItemComponent } from '../shared/goal/task-item.component';
import { GoalService, Goal, TaskService, Task } from '../shared/index';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * This class represents the lazy loaded GoalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  directives: [ TaskItemComponent ],
  templateUrl: 'goal.component.html',
  styleUrls: ['goal.component.css'],
  providers: [ GoalService ]
})

export class GoalComponent implements OnInit {

  errorMessage: string;
  currentResponse: {};
  goal: Goal;

  private sub: Subscription;

  /**
   * Creates an instance of the GoalComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected service: GoalService,
    protected route: ActivatedRoute,
    protected router: Router) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       let id = params['guid'];
       this.service.get(id)
                      .subscribe(
                        goal => this.goal = <Goal>goal,
                        error =>  this.errorMessage = <any>error
                        );

     });
  }

}
