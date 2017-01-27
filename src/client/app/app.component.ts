import { Component } from '@angular/core';
import { ToolbarComponent, NavbarComponent } from './nav/index';
import { MessageComponent, ProcessComponent } from './core/index';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  directives: [ToolbarComponent,NavbarComponent,MessageComponent,ProcessComponent]
})

export class AppComponent {
  constructor() {
    //console.log('Environment config', Config);
  }
}
