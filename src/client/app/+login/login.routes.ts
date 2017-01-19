import { Route } from '@angular/router';
import { LoginComponent, RegisterComponent } from './index';

export const LoginRoutes: Route[] = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
