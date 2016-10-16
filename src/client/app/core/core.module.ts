import { NgModule } from '@angular/core';
import { MessageService } from './message/message.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [MessageService]
})
export class CoreModule { }
