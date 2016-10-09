import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Config } from '../shared/index';
import { Task } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class TaskService {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(guid:string): Observable<Task> {
    return this.http.get(Config.API + '/goals/' + guid + '/tasks')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  list(guid:string): Observable<Task[]> {
    return this.http.get(Config.API + '/goals/' + guid + '/tasks')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(task:Task): Observable<string[]> {
    task.title = this.htmlEntities(task.title);
    let body = JSON.stringify(task);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Config.API + '/goals/' + task.goal + '/tasks',body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(task:Task): Observable<string[]> {
    return this.http.delete(Config.API + '/goals/'+ task.goal + '/tasks/' + task.uuid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(task:Task): Observable<string[]> {
    let body = JSON.stringify(task);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(Config.API + '/goals/'+ task.goal + '/tasks/' + task.uuid, body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  public workerTaskGatherTasks(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    console.log('Fetching Task Count for: ' + goal);
    let tasks: Task[] = [];
    let outcome = '';
    let obs = new Observable((observer:any) => {
      let taskgetter = this.list(goal).subscribe(
        tasks => {
          tasks = <Task[]>tasks;
          observer.next({control_uuid: control_uuid, outcome: 'success', message:'Tasks fetched successfully.',context:{params:{tasks:tasks,task_count:tasks.length}}})
        },
        error => {
          observer.error({control_uuid: control_uuid, outcome: error, message:'An error has occured fetching the tasks.'});
        },
        () => {
          observer.complete()
        }
      );
      return () => console.log('Observer Created for Working.')
    });

    return obs;
  }

  public workerTaskRemoveTasks(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: string = params.task_count;
    let tasks: Task[] = params.tasks;
    let obs = new Observable((observer:any) => {
      observer.next({control_uuid: control_uuid, outcome: 'success', message:'Tasks removed successfully.',context:{}});
      observer.complete();
    });
    return obs;
  }

  public workerTaskRemoveGoal(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: string = params.task_count;
    let obs = new Observable((observer:any) => {
      if(taskCount !== "0"){
        observer.error({control_uuid: control_uuid, outcome: 'error', message:'You can only delete a goal, when it is empty.'});
      } else {
        observer.next({control_uuid: control_uuid, outcome: 'success', message:'Goal removed successfully.',context:{}});
        observer.complete();
      }
    });
    return obs;
  }


  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

  /**
    * Handle Convert HTML entities
    */
  private htmlEntities(str:string): string {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
