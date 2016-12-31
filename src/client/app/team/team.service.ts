import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Team, TeamMembership } from './index';
import { User } from '../user/index';
import { MessageService, HelperService } from '../core/index';
import { Config } from '../shared/index';
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
  user: User;
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
    let user = this.getUser();
    this.itemSubscription.next(this.retrieveTeam(uuid,user.data_identity));
  }

  publishTeams(teams:Team[]) {
    this.teams = teams;
    this.sort();
    this.storeTeams();
    this.listSubscription.next(this.teams);
  }

  storeTeams() {
    this.teams.forEach(team => localStorage.setItem('team::' + team.uuid + ':' + team.identity, JSON.stringify(team)));
  }

  retrieveTeam(uuid:string,identity:string): Team {
    return (<Team>JSON.parse(localStorage.getItem('team::' + uuid + ':' + identity)));
  }

  addTeam(team:Team) {
    this.teams.push(team);
    this.publishTeams(this.teams);
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  sort() {
    this.helper.sortBy(this.teams,'title');
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Team[]} The Promise for the HTTP request.
   */
  list(user:User): Promise<Team[]> {
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.teamsGet();
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Team[]} The Promise for the HTTP request.
   */
  auth(user:User): Promise<Team[]> {
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    let params = {
      'Content-Type': 'application/json',
      'x-amz-security-token': '',
      'x-amz-date': '',
      'Authorization': ''
    };
    return api.authGet(params);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(uuid:string): Promise<any> {
    let user = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.teamsUuidGet({uuid:uuid});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(team:Team): Promise<Team> {
    team.title = this.htmlEntities(team.title);
    let user = this.getUser();
    team.identity = user.data_identity;
    // let body = JSON.stringify(team);
    let body = team;
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.teamsPost({},body);
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
  put(team:Team): Promise<any> {
    team.title = this.htmlEntities(team.title);
    let user = this.getUser();
    let body = JSON.stringify(team);
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.teamsUuidPut({uuid:team.uuid},body);
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
