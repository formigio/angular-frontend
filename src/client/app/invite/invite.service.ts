import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/Rx';
import { HelperService } from '../core/index';
// import { Config } from '../shared/index';
import { User } from '../user/index';
import { Invite } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class InviteService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;

  private invites: Invite[] = [];
  private invite: Invite;

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

  publishInvite(invite:Invite) {
    this.invite = invite;
    this.itemSubscription.next(invite);
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
  get(id:string): Promise<Invite> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.makeRequest('/invites/{id}',{id:id});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // check(guid:string,uuid:string): Observable<any> {
  //   return this.http.get(Config.API + '/goals/' + guid + '/invites/' + uuid)
  //                   .map((res: Response) => res.json())
  //                   .catch(this.handleError);
  // }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  list(entity_type:string,entity_uuid:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.makeRequest('/invites',{entity_type:entity_type,entity_uuid:entity_uuid});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(invite:Invite): Promise<any> {
    let body = invite;
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.makeRequest('/invites',{},body);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // delete(invite:Invite): Observable<string[]> {
  //   return this.http.delete(Config.API + '/goals/'+ invite.entity + '/invites/' + invite.uuid)
  //                   .map((res: Response) => res.json())
  //                   .catch(this.handleError);
  // }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  // put(invite:Invite): Observable<string[]> {
  //   let body = JSON.stringify(invite);
  //   let headers = new Headers({ 'Content-Type': 'application/json' });
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.put(Config.API + '/goals/' + invite.entity + '/invites/' + invite.uuid, body, options)
  //                   .map((res: Response) => res.json())
  //                   .catch(this.handleError);
  // }

  // /**
  //   * Handle HTTP error
  //   */
  // private handleError (error: any) {
  //   // In a real world app, we might use a remote logging infrastructure
  //   // We'd also dig deeper into the error to get a better message
  //   let errMsg = (error.message) ? error.message :
  //     error.status ? `${error.status} - ${error.statusText}` : 'Server error';
  //   console.error(errMsg); // log to console instead
  //   return Observable.throw(errMsg);
  // }

  /**
    * Handle Convert HTML entities
    */
  // private htmlEntities(str:string): string {
  //   return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  // }

}
