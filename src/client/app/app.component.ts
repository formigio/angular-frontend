import { Component } from '@angular/core';
import { Config } from './shared/index';
import { Auth } from './shared/auth/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
})

export class AppComponent {
  constructor(private auth: Auth) {
    console.log('Environment config', Config);
  }
}
