import { NgModule } from '@angular/core';
import { MessageService } from './message/message.service';
import { HelperService } from './util/helper.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [ MessageService, HelperService ]
})
export class CoreModule { }
