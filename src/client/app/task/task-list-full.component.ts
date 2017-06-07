import { Component, OnInit, Input } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { TaskService, Task, TaskStruct } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'task-list-full',
  templateUrl: 'task-list-full.component.html',
  providers: [TaskService]
})

export class TaskListFullComponent implements OnInit {

  @Input() editable: boolean;

  tasks: Task[] = [];
  task: Task = TaskStruct;
  maxSequence: number = 0;
  loading: boolean = false;
  editing: boolean = false;
  searchTerm: string = '';

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService,
    protected helper: HelperService,
    protected service: TaskService
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
    this.refreshTasks();
  }

  refreshTasks() {
    this.loading = true;
    let params:any = {};
    params.term = '';
    if(this.searchTerm) {
      params.term = this.searchTerm;
    }
    this.message.startProcess('load_task_list',params);
  }

  toggleEditing() {
    if(this.editing) {
      this.editing = false;
    } else {
      this.editing = true;
    }
  }

  searchTasks(e:any) {
    if(e.keyCode === 13 && !e.shiftKey) {
        this.searchTerm = e.target.value;
        this.refreshTasks();
    }

    this.debounce(() => {
      if(e.target.value) {
        if(this.searchTerm === e.target.value) {
          return;
        }
        console.log(e.target.value);
        this.searchTerm = e.target.value;
        this.refreshTasks();
        //this.message.startProcess('load_task_list',{term:e.target.value});
      }
    },1250)();
  }

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  debounce(func:any, wait:number, immediate?:boolean) {
    var timeout:any;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };


} // Component end
