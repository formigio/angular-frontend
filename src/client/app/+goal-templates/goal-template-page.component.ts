import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalTemplateViewComponent } from '../goal-template/index';
import { TaskTemplateListComponent } from '../task-template/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-page',
  directives: [ GoalTemplateViewComponent, TaskTemplateListComponent ],
  templateUrl: 'goal-template-page.component.html'
})

export class GoalTemplatePageComponent implements OnInit {

  id: string;

  constructor(
    public auth: UserService,
    protected route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.auth.enforceAuthentication();
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
