import { Component, OnInit } from '@angular/core';
import { GoalService, Goal, TaskService, Task } from '../shared/index';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';

/**
 * This class represents the lazy loaded GoalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  templateUrl: 'goal.component.html',
  styleUrls: ['goal.component.css'],
  providers: [ GoalService, TaskService ]
})

export class GoalComponent implements OnInit {

  errorMessage: string;
  currentResponse: {};
  goal: Goal;
  tasks: Task[] = [];
  newTaskTitle: '';
  task: Task = {
    complete: 'false',
    uuid: '',
    title: '',
    goal: ''
  };

  private sub: Subscription;

  /**
   * Creates an instance of the GoalComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected service: GoalService,
    protected taskService: TaskService,
    protected route: ActivatedRoute,
    protected router: Router) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       let id = params['guid'];
       this.service.get(id)
                      .subscribe(
                        goal => this.goal = <Goal>goal,
                        error =>  this.errorMessage = <any>error,
                        () => this.fetchTasks()
                        );

     });
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(goal:Goal): boolean {
    this.service.delete(goal.guid)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.router.navigate(['/'])
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  accomplishGoal(goal:Goal): boolean {
    goal.accomplished = 'true';
    this.service.put(goal)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => console.log('Goal Successfully saved.')
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  fetchTasks() {
    console.log('Getting Tasks for: ' + this.goal.guid);
    this.taskService.list(this.goal.guid)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Tasks are Fetched')
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
    this.taskService.post(newTask)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.tasks.push(newTask)
      );
    // this.tasks.push(newTask)
    this.task.title = '';
    return false;
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTask(task:Task): boolean {
    this.taskService.delete(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => task.uuid = ''
      );
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  saveTask(task:Task): boolean {
    this.taskService.put(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  completeTask(task:Task): boolean {
    task.complete = 'true';
    this.taskService.put(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error
      );
    return false;
  }

}
