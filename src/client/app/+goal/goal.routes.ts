import { Route } from '@angular/router';
import { GoalComponent, GoalViewComponent } from './index';

export const GoalRoutes: Route[] = [
  {
    path: 'goal/:guid',
    component: GoalComponent
  },
  {
    path: 'goal/:guid/invite/:uuid',
    component: GoalViewComponent
  }
];
