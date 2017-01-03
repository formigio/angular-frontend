import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Config } from '../shared/index';
import { User } from '../user/index';
import { Invite } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

declare let apigClientFactory: any;

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class InviteService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;

  private invites: Invite[] = [];

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http) {}


  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishInvites(invites:Invite[]) {
    this.invites = invites;
    this.listSubscription.next(invites);
  }

  addInvite(invite:Invite) {
    this.invites.push(invite);
    this.publishInvites(this.invites);
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
  get(guid:string): Observable<Invite> {
    return this.http.get(Config.API + '/goals/' + guid + '/invites')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  check(guid:string,uuid:string): Observable<any> {
    return this.http.get(Config.API + '/goals/' + guid + '/invites/' + uuid)
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
    return api.invitesGet({goal:goal});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(invite:Invite): Promise<any> {
    let body = invite;
    let user = this.getUser();
    let api = apigClientFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.invitesPost({},body);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(invite:Invite): Observable<string[]> {
    return this.http.delete(Config.API + '/goals/'+ invite.goal + '/invites/' + invite.uuid)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(invite:Invite): Observable<string[]> {
    let body = JSON.stringify(invite);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.put(Config.API + '/goals/' + invite.goal + '/invites/' + invite.uuid, body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
    * Handle HTTP error
    */
  private handleError (error: any) {
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
  // private htmlEntities(str:string): string {
  //   return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // }

}
