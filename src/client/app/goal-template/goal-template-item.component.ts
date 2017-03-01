import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../core/index';
import { GoalTemplateService, GoalTemplate } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-template-item',
  templateUrl: 'goal-template-item.component.html',
  providers: [ GoalTemplateService ]
})

export class GoalTemplateItemComponent implements OnInit {

  @Input() goalTemplate:GoalTemplate;

  state: string = 'view';
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
    if(!this.goalTemplate.id) {
      this.message.startProcess('goal_template_create',{goalTemplate:this.goalTemplate,navigate_to:'/goal_template/' + this.goalTemplate.id});
    }
    this.setDocs();
  }

  edit() {
    this.state = 'edit';
  }

  cancel() {
    this.state = 'view';
  }

  persistGoalTemplate() {
    this.state='view';
    this.goalTemplate.changed = true;
    this.message.startProcess('goal_template_save',{goalTemplate:this.goalTemplate});
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

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoalTemplate(goalTemplate:GoalTemplate): boolean {
    this.goalTemplate.changed = true;
    this.message.startProcess('goal_template_delete',{id:goalTemplate.id});
    return false;
  }

  navigateTo(goalTemplate:GoalTemplate) {
    this.message.startProcess('navigate_to',{navigate_to:'/goal-template/' + goalTemplate.id});
  }

}
