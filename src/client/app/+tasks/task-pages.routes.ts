import { Route } from '@angular/router';
import { TaskPageComponent, TasksPageComponent } from './index';

export const TaskPagesRoutes: Route[] = [
  {
    path: 'tasks',
    component: TasksPageComponent
  },
  {
    path: 'task/:id',
    component: TaskPageComponent
  }
];
