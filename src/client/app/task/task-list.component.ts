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
  providers: [TaskService]
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
      protected helper: HelperService,
      protected service: TaskService,
      protected route: ActivatedRoute
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TaskService');
  }

 /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      if(this.goal = params['guid']) {
        this.service.getListReplay()
                .subscribe(
                  tasks => {
                    console.log('Getting New Tasks from Service: count: ' + tasks.length);
                    this.tasks = <Task[]>tasks;
                  }
                );
        this.fetchTasks();
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
      } // If Task Title
    }); // Task Lines foreach
    this.task.title = '';
  }

} // Component end
