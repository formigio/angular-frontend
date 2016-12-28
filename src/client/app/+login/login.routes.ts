import { Route } from '@angular/router';
import { LoginComponent, LogoutComponent } from './index';

export const LoginRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent
  },{
    path: 'logout',
    component: LogoutComponent
  }
];
