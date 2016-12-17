import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MessageService, HelperService } from '../core/index';
import { Config } from '../shared/index';
import { User } from '../user/index';
import { TeamMember } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare let apigClientFactory: any;

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class TeamMemberService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  teammember: TeamMember;
  teammembers: TeamMember[];
  user: User;

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(
    private http: Http,
    private message: MessageService,
    private helper: HelperService
  ) {}

  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishTeamMember(teammember:TeamMember) {
    this.get(teammember).subscribe(
      teammember => this.itemSubscription.next(teammember)
    );
  }

  publishTeamMembers(teammembers:TeamMember[]) {
    this.teammembers = teammembers;
    this.sort();
    this.listSubscription.next(this.teammembers);
  }

  sort() {
    this.helper.sortBy(this.teammembers,'user_email');
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
  list(team_uuid:string): Promise<any> {
    let user: User = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });

    return api.teamMembersGet();
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  get(teammember:TeamMember): Observable<TeamMember> {
    let url = '/teams/membership/?team=' + teammember.uuid + '&user=' + teammember.identity;
    return this.http.get(Config.API + url)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(teammember:TeamMember): Observable<string[]> {
    let body = JSON.stringify(teammember);
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
  delete(teammember:TeamMember): Observable<string[]> {
    let url = '/teams/membership/?team=' + teammember.uuid + '&user=' + teammember.identity;
    return this.http.delete(Config.API + url)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(teammember:TeamMember): Observable<string[]> {
    let body = JSON.stringify(teammember);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(Config.API + '/teams/membership',body, options)
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

}
