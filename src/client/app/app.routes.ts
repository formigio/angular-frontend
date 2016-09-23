import { Routes } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { GoalPagesRoutes } from './+goals/index';
import { LoginRoutes } from './+login/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...GoalPagesRoutes,
  ...LoginRoutes
];
