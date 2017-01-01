import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
import { Config } from '../shared/index';
import { User } from '../user/index';
import { Task } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare let apigClientFactory: any;

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class TaskService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;

  private tasks: Task[] = [];

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private helper: HelperService) {}

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  refreshTasks(goal:string) {
    this.list(goal).then(
      response => this.tasks = response.data
    ).catch(
      error => console.log(error)
    );
  }

  publishTasks(tasks:Task[]) {
    this.tasks = tasks;
    this.listSubscription.next(tasks);
  }

  addTask(task:Task) {
    this.tasks.push(task);
    this.sortTasks();
    this.listSubscription.next(this.tasks);
  }

  sortTasks() {
    this.helper.sortBy(this.tasks,'title');
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
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
  list(goal:string): Promise<any> {
    let user = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.tasksGet({goal:goal});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(task:Task): Promise<any> {
    task.title = this.htmlEntities(task.title);
    let body = task;
    let user = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.tasksPost({},body);
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
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(task:Task): Promise<any> {
    task.title = this.htmlEntities(task.title);
    let body = JSON.stringify(task);
    let user = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.tasksUuidPut({uuid:task.uuid},body);
  }

  /**
    * Handle HTTP error
    */
  private handleError(error: any) {
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
