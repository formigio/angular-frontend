import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs';
import { Goal, GoalWorker } from './index';
import { Config } from '../shared/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class GoalService {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}

  public goal: ReplaySubject<any> = new ReplaySubject(1);

  getWorker() {
    return new GoalWorker(this);
  }

  getGoal(guid:string): ReplaySubject<any> {
    this.get(guid).subscribe(
      goal => this.goal.next(goal)
    );
    return this.goal;
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(guid:string): Observable<Goal> {
    return this.http.get(Config.API + '/goals/' + guid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(goal:Goal): Observable<string[]> {
    goal.goal = this.htmlEntities(goal.goal);
    let body = JSON.stringify(goal);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Config.API + '/goals',body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(guid:string): Observable<string[]> {
    return this.http.delete(Config.API + '/goals/' + guid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(goal:Goal): Observable<string[]> {
    let body = JSON.stringify(goal);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(Config.API + '/goals/' + goal.guid, body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    // let errMsg = (error.message) ? error.message :
    //   error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(error); // log to console instead
    return Observable.throw(error);
  }

  /**
    * Handle Convert HTML entities
    */
  private htmlEntities(str:string): string {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
