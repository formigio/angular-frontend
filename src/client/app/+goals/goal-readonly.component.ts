import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MessageService } from '../core/index';
import { GoalViewComponent } from '../goal/index';
import { TaskListComponent } from '../task/index';
import { InviteService, Invite } from '../invite/index';
import { AuthenticationService } from '../+login/index';

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

  private sub: Subscription;
  private success: string;
  private validInvite: Invite;
  private errorMessage: string;

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    protected auth: AuthenticationService,
    protected service: InviteService,
    protected route: ActivatedRoute,
    protected message: MessageService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = params['goal_uuid'];
      let token = params['invite_uuid'];
      this.service
        .check(id,token).subscribe(
          invite => this.validInvite = <Invite>invite,
          error => this.message.setFlash('Invite has expired, or been removed.','danger'),
          () => {
            if(this.validInvite.uuid) {
                this.service.get(id)
                    .subscribe(
                      success => this.success,
                      error =>  this.errorMessage = <any>error,
                      () => this.message.setFlash('Valid Invite Found','success')
                    );
            } else {
              this.message.setFlash('Invite has expired, or been removed.','danger');
              this.auth.enforceAuthentication();
            }
          }
      );
    });
  }
}
