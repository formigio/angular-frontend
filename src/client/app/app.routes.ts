import { Routes } from '@angular/router';

import { AboutRoutes } from './+about/index';
import { HomeRoutes } from './+home/index';
import { GoalRoutes } from './+goal/index';
import { LoginRoutes } from './+login/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...AboutRoutes,
  ...GoalRoutes,
  ...LoginRoutes
];
