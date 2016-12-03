import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Team, TeamMembership } from './index';
import { User } from '../user/index';
import { MessageService } from '../core/index';
import { Config, HelperService } from '../shared/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare let apigClientFactory: any;

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class TeamService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  team: Team;
  teams: Team[];

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(
    private http: Http,
    private message: MessageService,
    private helper: HelperService) {}

  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishTeam(uuid:string) {
    this.get(uuid).subscribe(
      team => this.itemSubscription.next(team)
    );
  }

  publishTeams(teams:Team[]) {
    this.teams = teams;
    this.sort();
    this.listSubscription.next(this.teams);
  }

  sort() {
    this.helper.sortBy(this.teams,'title');
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  list(user:User): Observable<Team[]> {
    // return this.http.get(Config.API + '/teams?user=' + user)
    //                 .map((res: Response) => res.json())
    //                 .catch(this.handleError);
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.teamsGet()
      .map((result:any) => result.json())
      .catch((result:any) => {
        console.log('Error Response from Gateway');
        console.log(result);
      });
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(uuid:string): Observable<Team> {
    return this.http.get(Config.API + '/teams/' + uuid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(team:Team): Observable<string[]> {
    team.title = this.htmlEntities(team.title);
    let body = JSON.stringify(team);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Config.API + '/teams',body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  postMembership(membership:TeamMembership): Observable<string[]> {
    let body = JSON.stringify(membership);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Config.API + '/teams/membership',body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(uuid:string): Observable<string[]> {
    return this.http.delete(Config.API + '/teams/' + uuid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(team:Team): Observable<string[]> {
    team.title = this.htmlEntities(team.title);
    let body = JSON.stringify(team);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(Config.API + '/teams/' + team.uuid, body, options)
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
