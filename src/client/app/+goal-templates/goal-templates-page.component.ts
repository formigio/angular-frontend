import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GoalTemplateListComponent } from '../goal-template/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-templates-page',
  directives: [ GoalTemplateListComponent ],
  templateUrl: 'goal-templates-page.component.html'
})

export class GoalTemplatesPageComponent implements OnInit {

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
