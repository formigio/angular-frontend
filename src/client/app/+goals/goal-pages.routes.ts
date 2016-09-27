import { Route } from '@angular/router';
import { GoalPageComponent, GoalsPageComponent, GoalReadonlyComponent } from './index';

export const GoalPagesRoutes: Route[] = [
  {
    path: 'goals',
    component: GoalsPageComponent
  },
  {
    path: 'goal/:guid',
    component: GoalPageComponent
  },
  {
    path: 'goal/:guid/invite/:uuid',
    component: GoalReadonlyComponent
  }
];
