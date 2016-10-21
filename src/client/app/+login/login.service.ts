import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../core/index';
import { Config } from '../shared/index';

export class User {
    constructor(
        public uuid: string,
        public email: string,
        public password_hash: string,
        public password: string) { }
}

@Injectable()
export class AuthenticationService {

    errorMsg: string = '';
    successMsg: string = '';
    response: User;

    constructor(
        private _router: Router,
        private http: Http,
        private messaging: MessageService
    ) { }

    logout() {
        localStorage.removeItem('user');
        this._router.navigate(['/login']);
    }

    login(user:User) {
        let hash = this.password(user);
        hash.subscribe(
                response => user.password_hash = response.password_hash,
                error =>  this.errorMsg = <any>error,
                () => { user.password = user.password_hash;
                    user.password_hash = '';
                    this.authenticateUser(user).subscribe(
                        response => this.response = <User>response,
                        error => this.messaging.setFlash('There has been a problem processing your request.','danger'),
                        () => {
                            if(this.response.uuid) {
                                let user = this.response;
                                localStorage.setItem('user', JSON.stringify(user));
                                this.messaging.setFlash('Login Successful.','success');
                                this._router.navigate(['/']);
                            } else {
                                this.messaging.setFlash('Login Unsuccessful. Bad Credentials, perhaps?','danger');
                            }
                        });
                    }
                );
    }

    register(user:User) {
        let hash = this.password(user);
        hash.subscribe(
                    response => user.password_hash = response.password_hash,
                    error =>  this.errorMsg = <any>error,
                    () => { user.password = user.password_hash;
                        user.password_hash = '';
                        user.uuid = Math.random().toString().split('.').pop();
                        this.createUser(user).subscribe(
                        response => this.successMsg = response,
                        error => this.errorMsg,
                        () => this._router.navigate(['/login'])); }
                    );
    }

    authenticateUser(user:User) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users/authenticate',body, options)
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

    password(user:User) {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(Config.API + '/users/password',body, options)
                        .map((res: Response) => res.json())
                        .catch(this.handleError);
    }

    checkCredentials() {
        return localStorage.getItem('user') !== null;
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
