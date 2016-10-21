import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { Config } from '../shared/index';
import { Invite } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class InviteService {

  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

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

  refreshInvites(guid:string) {
    this.list(guid).subscribe(
      invites => this.invites = invites,
      error => console.log(error),
      () => {
        this.listSubscription.next(this.invites);
      }
    );
  }

  addInvite(invite:Invite) {
    this.post(invite).subscribe(
      null,
      error => console.log(error),
      () => {
        this.invites.push(invite);
        this.listSubscription.next(this.invites);
      }
    );
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
  list(guid:string): Observable<Invite[]> {
    return this.http.get(Config.API + '/goals/' + guid + '/invites')
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(invite:Invite): Observable<string[]> {
    invite.email = this.htmlEntities(invite.email);
    let body = JSON.stringify(invite);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(Config.API + '/goals/' + invite.goal + '/invites',body, options)
                    .map((res: Response) => res.json())
                    .catch(this.handleError);
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
    invite.email = this.htmlEntities(invite.email);
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
  private htmlEntities(str:string): string {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

}
