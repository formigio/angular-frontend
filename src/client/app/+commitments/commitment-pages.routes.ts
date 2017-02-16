import { Route } from '@angular/router';
import { CommitmentsPageComponent, WorkerCommitmentsPageComponent } from './index';

export const CommitmentPagesRoutes: Route[] = [
  {
    path: 'commitments',
    component: CommitmentsPageComponent
  },
  {
    path: 'commitments/:workerId',
    component: WorkerCommitmentsPageComponent
  }
];
