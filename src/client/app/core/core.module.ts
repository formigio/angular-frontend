import { NgModule } from '@angular/core';
import { ProcessService } from './hormone/process.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [ProcessService]
})
export class CoreModule { }
