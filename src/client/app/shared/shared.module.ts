import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToolbarComponent } from './toolbar/index';
import { NavbarComponent } from './navbar/index';
import { GoalListService } from './goal/index';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule],
  declarations: [ToolbarComponent, NavbarComponent],
  exports: [ToolbarComponent, NavbarComponent,
    CommonModule, FormsModule, RouterModule, NgbModule]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [GoalListService]
    };
  }
}
