import { Component, Input } from '@angular/core';
import { TaskService, Task, Goal } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-item',
  templateUrl: 'task-item.component.html',
  providers: [ TaskService ]
})

export class TaskItemComponent {

  @Input() goal:Goal;

  errorMessage: string = '';
  currentResponse: {};
  tasks: Task[] = [];
  task: Task = {
    complete: 'false',
    uuid: '',
    title: '',
    goal: ''
  };

  /**
   *
   * @param 
   */
  constructor(
    protected service: TaskService
    ) {}


  fetchTasks() {
    console.log('Getting Tasks for: ' + this.goal.guid);
    this.service.list(this.goal.guid)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Tasks are Fetched')
                  );
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTask(uuid: string): boolean {
    this.service.delete(uuid)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  saveTask(task:Task): boolean {
    this.service.put(task)
      .subscribe(
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
    this.service.put(task)
      .subscribe(
        error => this.errorMessage = <any>error
      );
    return false;
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
        () => this.tasks.push(newTask)
      );
    // this.tasks.push(newTask)
    this.task.title = '';
    return false;
  }


}
