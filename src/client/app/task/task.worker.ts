import { Observable } from 'rxjs/Observable';
import { Task, TaskService } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
export class TaskWorker {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(public service: TaskService) {}

  public workerTaskGatherTasks(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    console.log('Fetching Task Count for: ' + goal);
    let tasks: Task[] = [];
    let outcome = '';
    let obs = new Observable((observer:any) => {
      let taskgetter = this.service.list(goal).subscribe(
        tasks => {
          tasks = <Task[]>tasks;
          observer.next({control_uuid: control_uuid, outcome: 'success', message:'Tasks fetched successfully.',context:{params:{tasks:tasks,task_count:tasks.length}}})
        },
        error => {
          observer.error({control_uuid: control_uuid, outcome: 'error', message:'An error has occured fetching the tasks.'});
        },
        () => {
          observer.complete()
        }
      );
      return () => console.log('Observer Created for Working.')
    });

    return obs;
  }

  public deleteTask(control_uuid: string, params: any): Observable<any> {
    let task: Task = params.task;
    let obs = new Observable((observer:any) => {
      this.service.delete(task).subscribe(
        null,
        error => observer.error({control_uuid: control_uuid, outcome: 'error', message:'Error has occured while removing tasks.',context:{params:{}}}),
        () => {
          observer.next({control_uuid: control_uuid, outcome: 'success', message:'Tasks removed successfully.',context:{params:{task_deleted:task.uuid}}});
          observer.complete();
        }
      );
    });
    return obs;
  }


  public workerTaskRemoveTasks(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: string = params.task_count;
    let tasks: Task[] = params.tasks;
    let tasksRemoved: string[] = [];
    let obs = new Observable((observer:any) => {
      if(tasks.length === 0) {
        observer.next({control_uuid: control_uuid, outcome: 'success', message:'No Tasks to Remove.',context:{params:{task_count:0}}});
        observer.complete();
      }
      tasks.forEach((task) => {
        this.service.delete(task).subscribe(
          null,
          error => observer.error({control_uuid: control_uuid, outcome: 'error', message:'Error has occured while removing tasks.',context:{params:{}}}),
          () => {
            tasksRemoved.push(task.uuid);
            if(tasks.length === tasksRemoved.length) {
              observer.next({control_uuid: control_uuid, outcome: 'success', message:'Tasks removed successfully.',context:{params:{task_count:0}}});
              observer.complete();
            }
          }
        );
      });
    });
    return obs;
  }

}
