import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
import { User } from '../user/index';
import { Task } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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
  constructor(private http: Http, private helper: HelperService) { }

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
    this.helper.sortBy(tasks,'title');
    this.tasks = tasks;
    this.listSubscription.next(tasks);
  }

  sortTasks() {
    this.helper.sortBy(this.tasks,'title');
    this.listSubscription.next(this.tasks);
  }

  removeTask(id:string) {
    let checked:Task[] = [];
    this.tasks.forEach((task) => {
      if(id === task.id) {
        task.title = '';
      }
      checked.push(task);
      if(checked.length===this.tasks.length) {
        this.publishTasks(checked);
      }
    });
  }

  publishTask(taskToPublish:Task) {
    let checked:Task[] = [];
    this.tasks.forEach((task) => {
      if(taskToPublish.id === task.id) {
        task = taskToPublish;
      }
      checked.push(task);
      if(checked.length===this.tasks.length) {
        this.publishTasks(checked);
      }
    });
  }

  addTask(task:Task) {
    this.tasks.push(task);
    this.publishTasks(this.tasks);
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
  list(goal:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/tasks',{params:{goal_id:goal},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(task:Task): Promise<any> {
    let body = {title:task.title,goal_id:task.goal_id};
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/tasks',{headers:{'x-identity-id':user.worker.identity}},body);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(id:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.delete('/tasks/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(task:Task): Promise<any> {
    let body = {
      title:task.title,
      work_status:task.work_status
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/tasks/{id}',{path:{id:task.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

}
