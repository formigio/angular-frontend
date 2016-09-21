import { Component, OnInit } from '@angular/core';
import { GoalService, Goal, TaskService, Task, InviteService, Invite } from '../shared/index';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * This class represents the lazy loaded GoalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  templateUrl: 'goal-view.component.html',
  providers: [ GoalService, TaskService ]
})

export class GoalViewComponent implements OnInit {

  errorMessage: string;
  currentResponse: {};
  goal: Goal;
  tasks: Task[] = [];
  validInvite: Invite;

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
    protected taskService: TaskService,
    protected inviteService: InviteService,
    protected route: ActivatedRoute,
    protected router: Router) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['guid'];
      let token = params['uuid'];
      // @TODO: Verify the Invite is still valid
      this.inviteService
        .check(id,token).subscribe(
          invite => this.validInvite = <Invite>invite,
          error => this.errorMessage = error,
          () => {
            if(this.validInvite.uuid) {
                this.service.get(id)
                    .subscribe(
                      goal => this.goal = <Goal>goal,
                      error =>  this.errorMessage = <any>error,
                      () => this.fetchTasks()
                    );
            } else {
              this.errorMessage = 'Invite has expired, or been removed.';
            }
          }
      );

      });
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  fetchTasks() {
    console.log('Getting Tasks for: ' + this.goal.guid);
    this.taskService.list(this.goal.guid)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Tasks are Fetched')
                  );
  }

}
