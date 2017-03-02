import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
import { User } from '../user/index';
import { TaskTemplate, TaskTemplateStruct } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class TaskTemplateService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;
  taskTemplate: TaskTemplate = TaskTemplateStruct;
  taskTemplates: TaskTemplate[] = [];

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private helper: HelperService) { }


  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishTaskTemplate(taskTemplate:TaskTemplate) {
    this.itemSubscription.next(taskTemplate);
  }

  publishTaskTemplates(taskTemplates:TaskTemplate[]) {
    this.taskTemplates = taskTemplates;
    this.sort();
    this.listSubscription.next(this.taskTemplates);
  }

  removeTaskTemplate(id:string) {
    let checked:TaskTemplate[] = [];
    this.taskTemplates.forEach((taskTemplate) => {
      if(id === taskTemplate.id) {
        taskTemplate.title = '';
      }
      checked.push(taskTemplate);
      if(checked.length===this.taskTemplates.length) {
        this.publishTaskTemplates(checked);
      }
    });
  }

  updateTaskTemplate(taskTemplateToUpdate:TaskTemplate) {
    this.publishTaskTemplate(taskTemplateToUpdate);
    let checked:TaskTemplate[] = [];
    this.taskTemplates.forEach((taskTemplate) => {
      if(taskTemplateToUpdate.id === taskTemplate.id) {
        taskTemplate = taskTemplateToUpdate;
      }
      checked.push(taskTemplate);
      if(checked.length===this.taskTemplates.length) {
        this.publishTaskTemplates(checked);
      }
    });
  }

  addTaskTemplate(taskTemplate:TaskTemplate) {
    this.publishTaskTemplate(taskTemplate);
    this.taskTemplates.push(taskTemplate);
    this.publishTaskTemplates(this.taskTemplates);
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  sort() {
    this.helper.sortBy(this.taskTemplates,'sequence');
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Task[]} The Promise for the HTTP request.
   */
  list(goal:string = ''): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/task_templates',{params:{goal_template_id:goal},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(id:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/task_templates/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(taskTemplate:TaskTemplate): Promise<any> {
    let body = {
      title: taskTemplate.title,
      documentation: taskTemplate.documentation,
      goal_template_id: taskTemplate.goal_template_id,
      sequence: taskTemplate.sequence
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/task_templates',{headers:{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/task_templates/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(taskTemplate:TaskTemplate): Promise<any> {
    let body = {
      title: taskTemplate.title,
      documentation: taskTemplate.documentation,
      sequence: taskTemplate.sequence
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/task_templates/{id}',{path:{id:taskTemplate.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

}
