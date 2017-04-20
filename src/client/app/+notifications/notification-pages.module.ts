import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { NotificationsPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule],
    declarations: [ NotificationsPageComponent ],
    exports: [ NotificationsPageComponent ]
})

export class NotificationPagesModule { }
