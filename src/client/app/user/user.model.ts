export class User {
    constructor(
        public email: string,
        public password: string,
        public confirm_code?: string,
        public identity_provider?: string,
        public login_token?: string,
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
