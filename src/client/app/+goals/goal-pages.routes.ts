import { Route } from '@angular/router';
import { GoalPageComponent, GoalReadonlyComponent } from './index';

export const GoalPagesRoutes: Route[] = [
  {
    path: 'goal/:goal_uuid',
    component: GoalPageComponent
  },
  {
    path: 'goal/:id/invite/:hash',
    component: GoalReadonlyComponent
  }
];
