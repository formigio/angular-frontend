import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CoreModule, SharedModule, CommonModule],
  declarations: [ToolbarComponent, NavbarComponent],
  exports: [ToolbarComponent, NavbarComponent]
})
export class NavModule {}
