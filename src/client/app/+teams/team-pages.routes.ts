import { Route } from '@angular/router';
import {
    TeamPageComponent,
    TeamsPageComponent
} from './index';

export const TeamPagesRoutes: Route[] = [
  {
    path: 'teams',
    component: TeamsPageComponent
  },
  {
    path: 'team/:uuid',
    component: TeamPageComponent
  }
];
