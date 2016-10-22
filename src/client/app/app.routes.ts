import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutes } from './+home/index';
import { TeamPagesRoutes } from './+teams/index';
import { GoalPagesRoutes } from './+goals/index';
import { LoginRoutes } from './+login/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...TeamPagesRoutes,
  ...GoalPagesRoutes,
  ...LoginRoutes
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
