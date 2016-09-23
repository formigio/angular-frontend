import { NgModule } from '@angular/core';
import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { RouterModule } from '@angular/router';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [RouterModule],
  declarations: [ToolbarComponent, NavbarComponent],
  exports: [ToolbarComponent, NavbarComponent]
})
export class NavModule {
}
