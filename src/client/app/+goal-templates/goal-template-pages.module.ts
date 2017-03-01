import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';
import { GoalTemplatePageComponent, GoalTemplatesPageComponent } from './index';

@NgModule({
    imports: [SharedModule, CoreModule],
    declarations: [ GoalTemplatePageComponent, GoalTemplatesPageComponent ],
    exports: [ GoalTemplatePageComponent, GoalTemplatesPageComponent ]
})

export class GoalTemplatePagesModule { }
