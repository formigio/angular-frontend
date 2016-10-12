import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { TaskService, Task } from './index';

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

  @Input() editable: boolean;

  errorMessage: string = '';
  currentResponse: string = '';

  tasks: Task[] = [];

  task: Task = {
    complete: 'false',
    uuid: '',
    title: '',
    goal: '',
    deleted: false
  };

  goal: string;

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
      if(this.goal = params['guid']) {
        this.service.getTasks(this.goal)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks
                );
      }
     });
  }

  fetchTasks() {
    console.log('Fetching Tasks for: ' + this.goal);
    this.service.refreshTasks(this.goal);
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTask(): void {
    this.task.goal = this.goal;
    let taskLines = this.task.title.split('\n');
    taskLines.forEach((taskTitle) => {
      if(taskTitle) {
        let uuid = Math.random().toString().split('.').pop();
        let newTask:Task = {
          complete: 'false',
          uuid: uuid,
          title: taskTitle,
          goal: this.task.goal,
          deleted: false
        };
        this.service.addTask(newTask);
        // this.service.post(newTask)
        //   .subscribe(
        //     response => this.currentResponse,
        //     error => this.errorMessage = <any>error,
        //     () => {
        //       this.task.title = '';
        //       this.tasks.push(newTask);
        //       this.helper.sortBy(this.tasks,'title');
        //     }
        //   );
      } // If Task Title
    }); // Task Lines foreach
  }

} // Component end
