import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { TaskService, Task, TaskStruct } from './index';

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

  task: Task = TaskStruct;

  goal: string;

  loading: boolean = false;

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService,
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
    this.service.getListSubscription().subscribe(
      tasks => {
        this.loading = false;
        this.tasks = <Task[]>tasks;
        let newtasks:Task[] = [];
        let alltasks:Task[] = tasks;
        alltasks.forEach((task) => {
          if(task.title) {
            newtasks.push(task);
          }
        });
        this.tasks = newtasks;
      }
    );
    this.route.params.subscribe(params => {
      this.goal = params['goal_uuid'];
      this.refreshTasks();
    });
  }

  refreshTasks() {
    this.loading = true;
    this.tasks = [];
    this.message.startProcess('load_task_list',{goal:this.goal});
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTask(): void {
    let newTask:Task;
    this.task.goal_id = this.goal;
    let taskLines = this.task.title.split('\n');
    taskLines.forEach((taskTitle) => {
      if(taskTitle) {
        newTask = JSON.parse(JSON.stringify(TaskStruct));
        newTask.goal_id = this.task.goal_id;
        newTask.title = taskTitle;
        newTask.changed = true;
        this.tasks.push(newTask);
      } // If Task Title
    }); // Task Lines foreach
    this.task.title = '';
  }

} // Component end
