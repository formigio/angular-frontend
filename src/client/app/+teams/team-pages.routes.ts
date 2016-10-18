import { Route } from '@angular/router';
import {
    // GoalPageComponent,
    TeamsPageComponent
} from './index';

export const TeamPagesRoutes: Route[] = [
  {
    path: 'teams',
    component: TeamsPageComponent
  }
//   ,
//   {
//     path: 'goal/:guid',
//     component: GoalPageComponent
//   }
];
