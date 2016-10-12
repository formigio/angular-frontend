import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Config, HelperService } from '../shared/index';
import { Task, TaskWorker } from './index';
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
  constructor(private http: Http, private helper: HelperService) {}

  tasks: Task[] = [];

  public taskListReplay: ReplaySubject<any> = new ReplaySubject(1);

  getWorker() {
    return new TaskWorker(this);
  }

  getTasks(guid:string): ReplaySubject<any> {
    this.list(guid).subscribe(
      tasks => this.tasks = tasks,
      error => console.log(error),
      () => {
        this.sortTasks();
        this.taskListReplay.next(this.tasks);
      }
    );
    return this.taskListReplay;
  }

  refreshTasks(guid:string) {
    this.list(guid).subscribe(
      tasks => this.tasks = tasks,
      error => console.log(error),
      () => {
        this.sortTasks();
        this.taskListReplay.next(this.tasks);
      }
    );
  }

  addTask(task:Task) {
    console.log('-- Add Task --' + this.tasks.length);
    this.post(task).subscribe(
      null,
      error => console.log(error),
      () => {
        this.tasks.push(task);
        this.sortTasks();
        this.taskListReplay.next(this.tasks)
      }
    );
  }

  removeTask(task:Task) {
    // this.refreshTasks(task.goal);
    // console.log('-- Remove Task --' + this.tasks.length);
    // let taskToDelete:Task;
    // this.findTask(task).subscribe(
    //   task => {
    //     console.log('-- Found Task --');
    //     taskToDelete = task
    //   },
    //   error => console.log(error),
    //   () => {
        this.delete(task).subscribe(
          null,
          error => console.log(error),
          () => {
            task.uuid = '';
            // this.tasks = this.tasks.filter(this.isDeleted);
            // console.log('-- Sending in Tasklist --');
            // this.taskListReplay.next(this.tasks)
          }
        );
    //   }
    // );
  }

  isDeleted(task:Task) {
    console.log('-- Is Deleted --');
    if(task.deleted === true) {
      return true;
    }
    return false;
  }

  sortTasks() {
    this.helper.sortBy(this.tasks,'title');
  }

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

  private findTask(taskToFind:Task): Observable<any> {
    let searched: string[] = [];
    let obs = new Observable((observer:any) => {
      this.tasks.forEach((task) => {
        searched.push(task.uuid);
        console.log('-- Looking --');
        if(task.uuid === taskToFind.uuid) {
          console.log('-- Is Found --');
          observer.next(task);
        }
        if(searched.length === this.tasks.length) {
          observer.complete();
        }
      });
    });
    return obs;
  }

}
