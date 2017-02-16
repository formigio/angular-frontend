import { Component, OnInit } from '@angular/core';
import { WorkerCommitmentListComponent } from '../commitment/index';
import { UserService } from '../user/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'worker-commitments-page',
  directives: [ WorkerCommitmentListComponent ],
  templateUrl: 'worker-commitments-page.component.html'
})

export class WorkerCommitmentsPageComponent implements OnInit {

  /**
   * Creates an instance with the injected
   * UserService.
   *
   * @param {UserService} auth - The injected UserService.
   */
  constructor(
    public auth: UserService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
