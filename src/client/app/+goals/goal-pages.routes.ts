import { Route } from '@angular/router';
import { GoalPageComponent, GoalReadonlyComponent } from './index';

export const GoalPagesRoutes: Route[] = [
  {
    path: 'goal/:uuid',
    component: GoalPageComponent
  },
  {
    path: 'goal/:guid/invite/:uuid',
    component: GoalReadonlyComponent
  }
];
