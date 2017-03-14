import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
// import { Config } from '../shared/index';
import { User } from '../user/index';
import { Goal, GoalStruct } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class GoalService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;
  goal: Goal = GoalStruct;
  goals: Goal[] = [];
  instance: string;

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

  publishGoal(goal:Goal) {
    this.itemSubscription.next(goal);
  }

  publishGoals(goals:Goal[]) {
    this.goals = goals;
    this.sort();
    this.storeGoals();
    this.listSubscription.next(this.goals);
  }

  storeGoals() {
    this.goals.forEach(goal => localStorage.setItem('goal::' + goal.id, JSON.stringify(goal)));
  }

  storeGoal(goal:Goal) {
    this.goal = goal;
    localStorage.setItem('goal::' + goal.id, JSON.stringify(goal));
    this.publishGoal(goal);
  }

  retrieveGoal(id:string): Goal {
    return (<Goal>JSON.parse(localStorage.getItem('goal::' + id)));
  }

  removeGoal(id:string) {
    let checked:Goal[] = [];
    this.goals.forEach((goal) => {
      if(id === goal.id) {
        goal.title = '';
      }
      checked.push(goal);
      if(checked.length===this.goals.length) {
        this.publishGoals(checked);
      }
    });
  }

  updateGoal(goalToUpdate:Goal) {
    if(this.goal.id) {
      this.storeGoal(goalToUpdate);
    }
    if(this.goals.length) {
      let checked:Goal[] = [];
      this.goals.forEach((goal) => {
        if(goalToUpdate.id === goal.id) {
          goal = goalToUpdate;
        }
        checked.push(goal);
        if(checked.length===this.goals.length) {
          this.publishGoals(checked);
        }
      });
    }
  }

  addGoal(goal:Goal) {
    this.goals.push(goal);
    this.publishGoals(this.goals);
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  sort() {
    this.helper.sortBy(this.goals,'title');
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Goal[]} The Promise for the HTTP request.
   */
  list(team:string = ''): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/goals',{params:{team_id:team},headers:{'x-identity-id':user.worker.identity}});
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
    return api.get('/goals/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(goal:Goal): Promise<any> {
    let body = {
      title:goal.title,
      description:goal.description,
      team_id:goal.team_id,
      template_id:goal.template_id
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/goals',{headers:{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/goals/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(goal:Goal): Promise<any> {
    let body = {title:goal.title,description:goal.description,accomplished:goal.accomplished};
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/goals/{id}',{path:{id:goal.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

}
