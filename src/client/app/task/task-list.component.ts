import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessageService, HelperService } from '../core/index';
import { TaskService, Task } from './index';

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
    id: '',
    title: '',
    sequence: '0',
    goal_id: '',
    work_status: 'notstarted',
    system_status: 'pending',
    changed: false
  };

  goal: string;

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
        // let uuid = Math.random().toString().split('.').pop();
        newTask = {
          id: '',
          goal_id: this.task.goal_id,
          work_status: 'notstarted',
          system_status: 'pending',
          title: taskTitle,
          sequence: '0',
          // notes: '',
          changed: true
        };
        this.tasks.push(newTask);
      } // If Task Title
    }); // Task Lines foreach
    this.task.title = '';
  }

} // Component end
