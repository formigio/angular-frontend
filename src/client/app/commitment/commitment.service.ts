import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { HelperService } from '../core/index';
import { User } from '../user/index';
import { Commitment } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
@Injectable()
export class CommitmentService {

  public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);
  public listSubscription: ReplaySubject<any> = new ReplaySubject(1);

  user: User;

  startDate: Date;

  private commitments: Commitment[] = [];

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private http: Http, private helper: HelperService) {
    this.loadToday();
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  publishCommitments(commitmentData:any) {
    let commitments: Commitment[] = commitmentData.commitments;
    this.helper.sortBy(commitments,'promised_start');
    this.commitments = commitments;
    this.listSubscription.next(commitmentData);
  }

  sortCommitments() {
    this.helper.sortBy(this.commitments,'promised_start');
    this.listSubscription.next(this.commitments);
  }

  removeCommitment(id:string) {
    let checked:Commitment[] = [];
    let newList:Commitment[] = [];
    this.commitments.forEach((commitment) => {
      if(id !== commitment.id) {
        newList.push(commitment);
      }
      checked.push(commitment);
      if(checked.length===this.commitments.length) {
        this.publishCommitments({commitments:newList});
      }
    });
  }

  publishCommitment(commitmentToPublish:Commitment) {
    let checked:Commitment[] = [];
    this.commitments.forEach((commitment) => {
      if(commitmentToPublish.id === commitment.id) {
        commitment = commitmentToPublish;
      }
      checked.push(commitment);
      if(checked.length===this.commitments.length) {
        this.publishCommitments({commitments:checked});
      }
    });
  }

  addCommitment(commitment:Commitment) {
    this.commitments.push(commitment);
    this.publishCommitments({commitments:this.commitments});
  }

  setUser(user:User) {
    this.user = user;
  }

  getUser(): User {
    return this.user;
  }

  incrementDate() {
    this.startDate.setHours(this.startDate.getHours() + 24);
  }

  decrementDate() {
    this.startDate.setHours(this.startDate.getHours() - 24);
  }

  loadToday() {
    this.startDate = this.getToday();
  }

  getToday():Date {
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    return today;
  }

  showPast():boolean {
    return this.startDate.toISOString() === this.getToday().toISOString();
  }

  getStartDate():Date {
    return this.startDate;
  }

  getEndDate():Date {
    let endDate = new Date(this.startDate.getTime());
    endDate.setHours(endDate.getHours() + 24);
    return endDate;
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
    return api.get('/commitments/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  listCommitmentByWorker(worker_id:string): Promise<any> {
    let start = this.startDate.toISOString();
    let end = this.getEndDate().toISOString();
    let showPast:boolean = this.showPast();
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get('/commitments/{worker_id}',{
      path:{worker_id:worker_id},
      params:{start:start,end:end,showpast:showPast},
      headers:{'x-identity-id':user.worker.identity}
    });
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  list(): Promise<any> {
    let start = this.startDate.toISOString();
    let end = this.getEndDate().toISOString();
    let showPast:boolean = this.showPast();
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.get(
      '/commitments',
      {
        params:{start:start,end:end,showpast:showPast},
        headers:{'x-identity-id':user.worker.identity}
      }
    );
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(commitment:Commitment): Promise<any> {
    let body = {
      worker_id:commitment.worker_id,
      task_id:commitment.task_id,
      promised_start:commitment.promised_start,
      promised_minutes:commitment.promised_minutes
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/commitments',{headers:{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/commitments/{id}',{path:{id:id},headers:{'x-identity-id':user.worker.identity}});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(commitment:Commitment): Promise<any> {
    let body = {
      promised_start:commitment.promised_start,
      promised_minutes:commitment.promised_minutes
    };
    let user = this.getUser();
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/commitments/{id}',{path:{id:commitment.id},headers:{'x-identity-id':user.worker.identity}},body);
  }

}
