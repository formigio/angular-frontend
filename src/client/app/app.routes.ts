import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRoutes } from './+home/index';
import { TeamPagesRoutes } from './+teams/index';
import { GoalPagesRoutes } from './+goals/index';
import { InvitePagesRoutes } from './+invites/index';
import { LoginRoutes } from './+login/index';

export const routes: Routes = [
  ...HomeRoutes,
  ...TeamPagesRoutes,
  ...GoalPagesRoutes,
  ...InvitePagesRoutes,
  ...LoginRoutes
];

export const appRoutingProviders: any[] = [

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
