import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { TaskService, Task } from './index';
import { Goal } from '../goal/index';

import { HelperService } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-list',
  templateUrl: 'task-list.component.html',
  providers: [ TaskService, HelperService ]
})

export class TaskListComponent implements OnInit {

  // @Input() goal:Goal;

  errorMessage: string = '';
  currentResponse: string = '';
  
  tasks: Task[] = [];

  task: Task = {
    complete: 'false',
    uuid: '',
    title: '',
    goal: ''
  };

  goal: Goal = {
    accomplished: '',
    guid: '',
    goal: ''
  };

  private sub: Subscription;

  /**
   *
   * @param 
   */
  constructor(
      protected service: TaskService,
      protected route: ActivatedRoute,
      protected helper: HelperService
  ) {}

 /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if(this.goal.guid = params['guid']) {
        this.fetchTasks();
      }
     });
  }

  fetchTasks() {
    console.log('Getting Tasks for: ' + this.goal.guid);
    this.service.list(this.goal.guid)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks,
                  error =>  this.errorMessage = <any>error,
                  () => this.helper.sortBy(this.tasks,'title')
                );
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTask(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.task.goal = this.goal.guid;
    let newTask:Task = {
      complete: 'false',
      uuid: uuid,
      title: this.task.title,
      goal: this.goal.guid
    };
    this.service.post(newTask)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => {
          this.tasks.push(newTask);
          this.helper.sortBy(this.tasks,'title');
        }
      );

    this.task.title = '';
    return false;
  }



  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // deleteTask(task:Task): boolean {
  //   this.service.delete(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // saveTask(task:Task): boolean {
  //   this.service.put(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  // completeTask(task:Task): boolean {
  //   task.complete = 'true';
  //   this.service.put(task)
  //     .subscribe(
  //       error => this.errorMessage = <any>error
  //     );
  //   return false;
  // }

}
