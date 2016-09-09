import { Route } from '@angular/router';
import { GoalComponent } from './index';

export const GoalRoutes: Route[] = [
  {
    path: 'goal/:guid',
    component: GoalComponent
  }
];
