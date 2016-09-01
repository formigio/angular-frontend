import { Component, OnInit } from '@angular/core';
import { GoalListService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
})

export class HomeComponent implements OnInit {

  newGoal: string = '';
  newAccomplished: boolean = false;
  errorMessage: string;
  goals: any[] = [];

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(public goalListService: GoalListService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.getGoals();
  }

  /**
   * Handle the nameListService observable
   */
  getGoals() {
    this.goalListService.get()
                     .subscribe(
                       goals => this.goals = goals,
                       error =>  this.errorMessage = <any>error
                       );
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(guid: string): boolean {
    this.goalListService.delete(guid)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addGoal(): boolean {
    let guid = Math.random().toString().split('.').pop();
    this.goalListService.post({goal:this.newGoal,accomplished:this.newAccomplished,guid:guid})
      .subscribe(
        error => this.errorMessage = <any>error
      );
    this.goals.push({guid:guid,goal:this.newGoal,accomplished:this.newAccomplished});
    this.newGoal = '';
    this.newAccomplished = false;
    return false;
  }

}
