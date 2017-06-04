import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskViewComponent } from '../task/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-page',
  directives: [ TaskViewComponent ],
  templateUrl: 'task-page.component.html'
})

export class TaskPageComponent implements OnInit {

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
