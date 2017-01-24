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

  removeInvite(id:string) {
    let checked:Invite[] = [];
    let newList:Invite[] = [];
    this.invites.forEach((invite) => {
      if(id !== invite.id) {
        newList.push(invite);
      }
      checked.push(invite);
      if(checked.length===this.invites.length) {
        this.publishInvites(newList);
      }
    });
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
    return api.get('/invites/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
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
  list(entity:string,entity_id:string): Promise<any> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/invites',{params:{status:'pending',entity:entity,entity_id:entity_id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(invite:Invite): Promise<any> {
    let user = this.getUser();
    let body = {
      entity:invite.entity,
      entity_id:invite.entity_id,
      invitee_name:invite.invitee_name,
      invitee_worker_id:invite.invitee_worker_id,
      inviter_worker_id:user.worker.id,
      inviter_name:invite.inviter_name
    };
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/invites',{headers:{'x-identity-id':user.worker.identity}},body);
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  delete(id:string): Promise<Invite> {
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.delete('/invites/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(invite:Invite): Promise<any> {
    let user = this.getUser();
    let body = {
      entity:invite.entity,
      entity_id:invite.entity_id,
      invitee_name:invite.invitee_name,
      inviter_worker_id:invite.inviter_worker_id,
      invitee_worker_id:invite.invitee_worker_id,
      inviter_name:invite.inviter_name,
      status:invite.status
    };
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/invites/{id}',{path:{id:invite.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

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
