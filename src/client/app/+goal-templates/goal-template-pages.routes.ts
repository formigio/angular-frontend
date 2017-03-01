import { Route } from '@angular/router';
import { GoalTemplatePageComponent, GoalTemplatesPageComponent } from './index';

export const GoalTemplatePagesRoutes: Route[] = [
  {
    path: 'team/:id/goal-templates',
    component: GoalTemplatesPageComponent
  },
  {
    path: 'goal-template/:id',
    component: GoalTemplatePageComponent
  }
];
