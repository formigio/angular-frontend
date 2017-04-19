import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/Rx';
import { MessageService, HelperService } from '../core/index';
import { User } from '../user/index';
import { Notification } from './index';

@Injectable()
export class NotificationService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  note: Notification;
  user: User;
  notes: Notification[];

  constructor(
    private message: MessageService,
    private helper: HelperService) { }

  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishNotification(note:Notification) {
    this.itemSubscription.next(note);
  }

  publishNotifications(notes:Notification[]) {
    this.notes = notes;
    this.sort();
    this.listSubscription.next(this.notes);
  }

  getNotes(): Notification[] {
    return this.notes;
  }

  addNotification(note:Notification) {
    this.notes.push(note);
    this.publishNotifications(this.notes);
  }

  removeNotification(id:string) {
    let checked:Notification[] = [];
    let notes:Notification[] = [];
    this.notes.forEach((note:Notification) => {
      if(id !== note.id) {
        notes.push(note);
      }
      checked.push(note);
      if(checked.length===this.notes.length) {
        this.publishNotifications(notes);
      }
    });
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  sort() {
    this.helper.sortBy(this.notes,'created_at');
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Note[]} The Promise for the HTTP request.
   */
  list(user:User): Promise<Notification[]> {
      let api = this.helper.apiFactory.newClient({
        accessKey: user.credentials.accessKey,
        secretKey: user.credentials.secretKey,
        sessionToken: user.credentials.sessionToken
      });
      return api.get('/notifications',{'headers':{'x-identity-id':user.worker.identity}});
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
    return api.get('/notifications/{id}',{id:id});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(note:Notification): Promise<Notification> {
    let user = this.getUser();
    let body = {content:note.content};
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/notifications',{'headers':{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/notifications/{id}',{path:{id:id},'headers':{'x-identity-id':user.worker.identity}});
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(note:Notification): Promise<any> {
    let user = this.getUser();
    let body = note;
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/notifications/{id}',{path:{id:note.id},'headers':{'x-identity-id':user.worker.identity}},body);
  }
}
