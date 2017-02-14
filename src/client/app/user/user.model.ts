export const UserCredentialsStruct = {
    accessKey: '',
    secretKey: '',
    sessionToken: '',
    expireTime: ''
};

export const UserWorkerStruct = {
    id:'',
    name:'',
    username:'',
    identity:''
};

export const UserStruct = {
    email: '',
    password: '',
    confirm_code: '',
    identity_provider: '',
    login_token: '',
    login_token_expires: '',
    credentials: UserCredentialsStruct,
    worker: UserWorkerStruct
};

export class User {
    constructor(
        public email: string,
        public password: string,
        public confirm_code?: string,
        public identity_provider?: string,
        public login_token?: string,
        public login_token_expires?: string,
        public credentials?: UserCredentials,
        public worker?: UserWorker
    ) { }
}

export class UserCredentials {
    constructor(
        public accessKey?: string,
        public secretKey?: string,
        public sessionToken?: string,
        public expireTime?: string
    ) { }
}

export class UserWorker {
    constructor(
        public id: string,
        public name: string,
        public username: string,
        public identity: string
    ) { }
}

export class UserModel {
    state() {
        // Unrecognized = No User Record in Local Storage
        // - Redirect to Login/Register Flow
        // Logged Out = User Record in Local Storage has No credentials
        // - Attempt Auth Flow
        // Authorized = User Record in Local Storage has credentials
    }

    loginflow() {
        //
    }
}