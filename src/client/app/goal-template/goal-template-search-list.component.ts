import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { GoalTemplateService, GoalTemplate, GoalTemplateSearchItemComponent, GoalTemplateStruct } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-search-list',
  directives: [ GoalTemplateSearchItemComponent ],
  templateUrl: 'goal-template-search-list.component.html',
  providers: [ GoalTemplateService ]
})

export class GoalTemplateSearchListComponent implements OnInit {

  goalTemplates: GoalTemplate[] = [];
  goalTemplate: GoalTemplate = GoalTemplateStruct;
  team: string = '';
  loading: boolean = false;

  constructor(
    public service: GoalTemplateService,
    public helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'GoalTemplateService');
  }

  ngOnInit() {
    this.service.getListSubscription().subscribe(
      goals => {
        this.loading = false;
        this.goalTemplates = <GoalTemplate[]>goals;
      }
    );
  }

}
