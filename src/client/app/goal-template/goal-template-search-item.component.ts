import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { GoalTemplateService, GoalTemplate } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-search-item',
  templateUrl: 'goal-template-search-item.component.html',
  providers: [ GoalTemplateService ]
})

export class GoalTemplateSearchItemComponent implements OnInit {

  @Input() goalTemplate:GoalTemplate;

  showFullDocumentation: boolean = false;
  fullDocumentation: string = '';

  /**
   *
   * @param
   */
  constructor(
    public message: MessageService,
    public service: GoalTemplateService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.setDocs();
  }

  toggleFullDocumentation() {
    if(this.showFullDocumentation === false) {
      this.showFullDocumentation = true;
    } else {
      this.showFullDocumentation = false;
    }
    this.setDocs();
  }

  setDocs() {
    if(this.goalTemplate.documentation === null || this.goalTemplate.documentation === '') {
      this.fullDocumentation = '';
    } else {
      let parts = this.goalTemplate.documentation.split('\n');
      if(this.showFullDocumentation) {
        this.fullDocumentation = parts.join('<br>');
      } else {
        this.fullDocumentation = parts.shift();
      }
    }
  }

  createGoalFromTemplate() {
    this.message.startProcess('goal_template_to_goal',{goalTemplate:this.goalTemplate});
  }

}
