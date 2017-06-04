import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskListComponent } from '../task/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'tasks-page',
  directives: [ TaskListComponent ],
  templateUrl: 'tasks-page.component.html'
})

export class TasksPageComponent implements OnInit {

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
