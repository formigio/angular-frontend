import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
// import { Config } from '../shared/index';
import { User } from '../user/index';
import { Goal } from './index';
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
  goal: Goal;
  goals: Goal[];
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

  publishGoal(uuid:string) {
    this.itemSubscription.next(this.retrieveGoal(uuid));
    // this.get(uuid).then(
    //   response => this.itemSubscription.next(response.data)
    // );
  }

  publishGoals(goals:Goal[]) {
    this.goals = goals;
    this.storeGoals();
    this.listSubscription.next(goals);
  }

  storeGoals() {
    this.goals.forEach(goal => localStorage.setItem('goal::' + goal.id, JSON.stringify(goal)));
  }

  retrieveGoal(id:string): Goal {
    return (<Goal>JSON.parse(localStorage.getItem('goal::' + id)));
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
    goal.title = this.htmlEntities(goal.title);
    let body = {title:goal.title,team_id:goal.team_id};
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
  // delete(guid:string): Observable<string[]> {
  //   return this.http.delete(Config.API + '/goals/' + guid)
  //                   .map((res: Response) => res.json())
  //                   .catch(this.handleError);
  // }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(goal:Goal): Promise<any> {
    goal.title = this.htmlEntities(goal.title);
    let body = goal;
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/goals/{id}',{path:{id:goal.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

  /**
    * Handle HTTP error
    */
  // private handleError (error: any) {
  //   // In a real world app, we might use a remote logging infrastructure
  //   // We'd also dig deeper into the error to get a better message
  //   // let errMsg = (error.message) ? error.message :
  //   //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  //   console.error(error); // log to console instead
  //   return Observable.throw(error);
  // }

  /**
    * Handle Convert HTML entities
    */
  private htmlEntities(str:string): string {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
