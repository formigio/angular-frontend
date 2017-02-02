import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { MessageService, HelperService } from '../core/index';
import { Config } from '../shared/index';
import { User, UserStruct } from './index';

declare let gapi:any;

@Injectable()
export class UserService {

    errorMsg: string = '';
    successMsg: string = '';
    response: User;
    user: User = UserStruct;

    public itemSubscription: ReplaySubject<any> = new ReplaySubject(1);

    public auth2: any;
    public googleUser: any;

    constructor(
        private _router: Router,
        private http: Http,
        private message: MessageService,
        private helper: HelperService
    ) { }

    loadGoogleApi() {
        gapi.load('auth2',() => this.initGoogleSignIn());
    }

    initGoogleSignIn() {
        this.auth2 = gapi.auth2.init({
            client_id: Config.GOOGLE_CLIENT_ID,
            scope: 'profile'
        });
        this.auth2.isSignedIn.listen((loggedIn:boolean) => {
            if(!loggedIn) {
                this.message.startProcess('user_logout',{});
            }
        });
        this.auth2.currentUser.listen((googleUser:any) => {

            this.user.email = googleUser.getBasicProfile().getEmail();
            this.user.identity_provider = 'google';
            this.user.login_token = googleUser.getAuthResponse().id_token;
            this.user.login_token_expires = googleUser.getAuthResponse().expires_at;

            this.message.startProcess('user_login_google',{
                token: this.user.login_token,
                user: this.user
            });
        });
    }

    public getGoogleAuth() {
        return this.auth2;
    }

    getItemSubscription(): ReplaySubject<any> {
        return this.itemSubscription;
    }

    publishUser(user:User) {
        this.itemSubscription.next(user);
    }

    logout() {
        localStorage.removeItem('user');
    }

    /**
     * Returns an Observable for the HTTP GET request for the JSON resource.
     * @return {string[]} The Observable for the HTTP request.
     */
    get(): Promise<any> {
        let user = this.retrieveUser();
        let api = this.helper.apiFactory.newClient({
            accessKey: user.credentials.accessKey,
            secretKey: user.credentials.secretKey,
            sessionToken: user.credentials.sessionToken
        });
        return api.get('/workers',{params:{identity:user.worker.identity},headers:{'x-identity-id':user.worker.identity}});
    }

    /**
     * Returns an Observable for the HTTP GET request for the JSON resource.
     * @return {string[]} The Observable for the HTTP request.
     */
    post(userToSave:User): Promise<any> {
        let user = this.retrieveUser();
        let body = userToSave.worker;
        let api = this.helper.apiFactory.newClient({
            accessKey: user.credentials.accessKey,
            secretKey: user.credentials.secretKey,
            sessionToken: user.credentials.sessionToken
        });
        return api.post('/workers',{headers:{'x-identity-id':user.worker.identity}},body);
    }

    /**
     * Returns an Observable for the HTTP GET request for the JSON resource.
     * @return {string[]} The Observable for the HTTP request.
     */
    put(userToSave:User): Promise<any> {
        let user = this.retrieveUser();
        let body = userToSave.worker;
        let api = this.helper.apiFactory.newClient({
        accessKey: user.credentials.accessKey,
        secretKey: user.credentials.secretKey,
        sessionToken: user.credentials.sessionToken
        });
        return api.put('/workers/{id}',{path:{id:user.worker.id}},body);
    }

    // register(user:User) {
    //     let hash = this.password(user);
    //     hash.subscribe(
    //                 response => user.password_hash = response.password_hash,
    //                 error =>  this.errorMsg = <any>error,
    //                 () => { user.password = user.password_hash;
    //                     user.password_hash = '';
    //                     user.uuid = Math.random().toString().split('.').pop();
    //                     this.createUser(user).subscribe(
    //                     response => this.successMsg = response,
    //                     error => this.errorMsg,
    //                     () => this._router.navigate(['/login'])); }
    //                 );
    // }


    /**
     * Returns an Promise for the HTTP GET request for the JSON resource.
     * @return {any} The Promise for the HTTP request.
     */
    // auth(user:User): Promise<any> {
    //     let api = apigClientFactory.newClient({
    //         accessKey: user.credentials.accessKey,
    //         secretKey: user.credentials.secretKey,
    //         sessionToken: user.credentials.sessionToken
    //     });
    //     let params = {
    //         'Content-Type': 'application/json',
    //         'x-amz-security-token': '',
    //         'x-amz-date': '',
    //         'Authorization': ''
    //     };
    //     return api.authGet(params);
    // }

    authenticateUser(user:User) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users/authenticate',body, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    validateUser(user_email:string) {
        let body = JSON.stringify({user_email:user_email});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users/validate',body, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    createUser(user:User) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users',body, options)
            .map((res: Response) => res.json())
            .catch(this.handleError);
    }

    testAuth(token:string) {
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer: ' + token
        });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(Config.API + '/authenticated', options)
            // .map((res: Response) => res.json())
            // .catch(this.handleError)
            ;
    }

    password(user:User) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users/password',body, options)
                        .map((res: Response) => res.json())
                        .catch(this.handleError);
    }

    retrieveUser(): User {
        let user: User = JSON.parse(localStorage.getItem('user'));
        if(user === null) {
            return this.user;
        }
        return user;
    }

    storeUser(user:User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.publishUser(user);
    }

    checkCredentials(): boolean {
        let user = this.retrieveUser();
        if(user === null) {
            return false;
        }
        if(user.credentials.accessKey && user.credentials.secretKey) {
            return true;
        }
        return false;
    }

    enforceAuthentication() {
        if (!this.checkCredentials()) {
            this._router.navigate(['/login']);
        }
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

}
