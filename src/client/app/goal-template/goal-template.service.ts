import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
import { User } from '../user/index';
import { GoalTemplate, GoalTemplateStruct } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class GoalTemplateService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;
  goalTemplate: GoalTemplate = GoalTemplateStruct;
  goalTemplates: GoalTemplate[] = [];

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

  publishGoalTemplate(goalTemplate:GoalTemplate) {
    this.itemSubscription.next(goalTemplate);
  }

  publishGoalTemplates(goalTemplates:GoalTemplate[]) {
    this.goalTemplates = goalTemplates;
    this.sort();
    this.listSubscription.next(this.goalTemplates);
  }

  removeGoalTemplate(id:string) {
    let checked:GoalTemplate[] = [];
    this.goalTemplates.forEach((goalTemplate) => {
      if(id === goalTemplate.id) {
        goalTemplate.title = '';
      }
      checked.push(goalTemplate);
      if(checked.length===this.goalTemplates.length) {
        this.publishGoalTemplates(checked);
      }
    });
  }

  updateGoalTemplate(goalTemplateToUpdate:GoalTemplate) {
    this.publishGoalTemplate(goalTemplateToUpdate);
    let checked:GoalTemplate[] = [];
    this.goalTemplates.forEach((goalTemplate) => {
      if(goalTemplateToUpdate.id === goalTemplate.id) {
        goalTemplate = goalTemplateToUpdate;
      }
      checked.push(goalTemplate);
      if(checked.length===this.goalTemplates.length) {
        this.publishGoalTemplates(checked);
      }
    });
  }

  addGoalTemplate(goalTemplate:GoalTemplate) {
    this.publishGoalTemplate(goalTemplate);
    this.goalTemplates.push(goalTemplate);
    this.publishGoalTemplates(this.goalTemplates);
  }

  clearTemplates() {
    this.goalTemplates = [];
    this.publishGoalTemplates(this.goalTemplates);
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  sort() {
    this.helper.sortBy(this.goalTemplates,'title');
  }

  list(team:string = ''): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/goal_templates',{params:{team_id:team},headers:{'x-identity-id':user.worker.identity}});
  }

  search(team:string = '',term:string = ''): Promise<any> {
    let user = this.getUser();
    let params = {};
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    params = {team_id:team,title:term};
    if(term) {
      (<any>params)['like'] = true;
    }
    return api.get('/goal_templates',{params:params,headers:{'x-identity-id':user.worker.identity}});
  }

  get(id:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/goal_templates/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(goalTemplate:GoalTemplate): Promise<any> {
    let body = {title:goalTemplate.title,documentation:goalTemplate.documentation,team_id:goalTemplate.team_id};
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/goal_templates',{headers:{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/goal_templates/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(goalTemplate:GoalTemplate): Promise<any> {
    let body = {title:goalTemplate.title,documentation:goalTemplate.documentation};
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/goal_templates/{id}',{path:{id:goalTemplate.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

}
