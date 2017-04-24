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

  tasks: Task[] = [];

  task: Task = TaskStruct;

  goal: string;

  maxSequence: number = 0;

  loading: boolean = false;

  editing: boolean = false;

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
        this.maxSequence = 0;
        alltasks.forEach((task) => {
          if(task.title) {
            newtasks.push(task);
          }
          this.maxSequence = Math.max(Number(task.sequence), this.maxSequence);
        });
        this.tasks = newtasks;
      }
    );
    this.tasks = [];
    this.route.params.subscribe(params => {
      this.goal = params['goal_uuid'];
      this.refreshTasks();
    });
  }

  refreshTasks() {
    this.loading = true;
    this.message.startProcess('load_task_list',{goal:this.goal});
  }

  addTask(): void {
    let newTask:Task;
    this.task.goal_id = this.goal;
    let taskLines = this.task.title.split('\n');
    taskLines.forEach((taskTitle) => {
      if(taskTitle) {
        this.maxSequence++;
        newTask = JSON.parse(JSON.stringify(TaskStruct));
        newTask.goal_id = this.task.goal_id;
        newTask.title = taskTitle;
        newTask.sequence = String(Number(this.maxSequence));
        newTask.changed = true;
        this.tasks.push(newTask);
      } // If Task Title
    }); // Task Lines foreach
    this.task.title = '';
  }

  watchInput(e:any):any {
    if(e.keyCode === 13 && !e.shiftKey) {
      this.addTask();
      return false;
    }
  }

  toggleEditing() {
    if(this.editing) {
      this.editing = false;
    } else {
      this.editing = true;
    }
  }

} // Component end
