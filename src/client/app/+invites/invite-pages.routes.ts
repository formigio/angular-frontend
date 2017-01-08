import { Route } from '@angular/router';
import {
    InvitePageComponent,
    InvitesPageComponent
} from './index';

export const InvitePagesRoutes: Route[] = [
  {
    path: 'invites',
    component: InvitesPageComponent
  },
  {
    path: 'invite/:uuid',
    component: InvitePageComponent
  }
];
