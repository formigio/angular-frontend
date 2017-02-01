import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Team } from './index';
import { User } from '../user/index';
import { MessageService, HelperService } from '../core/index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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
    private helper: HelperService) { }

  getItemSubscription(): ReplaySubject<any> {
    return this.itemSubscription;
  }

  getListSubscription(): ReplaySubject<any> {
    return this.listSubscription;
  }

  publishTeam(id:string) {
    this.itemSubscription.next(this.retrieveTeam(id));
  }

  publishTeams(teams:Team[]) {
    this.teams = teams;
    this.sort();
    this.storeTeams();
    this.listSubscription.next(this.teams);
  }

  storeTeams() {
    this.teams.forEach(team => localStorage.setItem('team::' + team.id, JSON.stringify(team)));
  }

  getTeams(): Team[] {
    return this.teams;
  }

  retrieveTeam(id:string): Team {
    return (<Team>JSON.parse(localStorage.getItem('team::' + id)));
  }

  addTeam(team:Team) {
    this.teams.push(team);
    this.publishTeams(this.teams);
  }

  removeTeam(id:string) {
    let checked:Team[] = [];
    let teams:Team[] = [];
    this.teams.forEach((team) => {
      if(id !== team.id) {
        teams.push(team);
      }
      checked.push(team);
      if(checked.length===this.teams.length) {
        this.publishTeams(teams);
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
    this.helper.sortBy(this.teams,'title');
  }

  /**
   * Returns an Promise for the HTTP GET request for the JSON resource.
   * @return {Team[]} The Promise for the HTTP request.
   */
  list(user:User): Promise<Team[]> {
      let api = this.helper.apiFactory.newClient({
        accessKey: user.credentials.accessKey,
        secretKey: user.credentials.secretKey,
        sessionToken: user.credentials.sessionToken
      });
      return api.get('/teams',{'headers':{'x-identity-id':user.worker.identity}});
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
    return api.get('/teams/{id}',{id:id});
  }

  /**
   * Returns an Observable for the HTTP POST request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  post(team:Team): Promise<Team> {
    let user = this.getUser();
    let body = {title:team.title};
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.post('/teams',{'headers':{'x-identity-id':user.worker.identity}},body);
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
    return api.delete('/teams/{id}',{path:{id:id},'headers':{'x-identity-id':user.worker.identity}});
  }


  /**
   * Returns an Observable for the HTTP GET request for the JSON resource.
   * @return {string[]} The Observable for the HTTP request.
   */
  put(team:Team): Promise<any> {
    let user = this.getUser();
    let body = team;
    let api = this.helper.apiFactory.newClient({
      accessKey: user.credentials.accessKey,
      secretKey: user.credentials.secretKey,
      sessionToken: user.credentials.sessionToken
    });
    return api.put('/teams/{id}',{path:{id:team.id},'headers':{'x-identity-id':user.worker.identity}},body);
  }

}
