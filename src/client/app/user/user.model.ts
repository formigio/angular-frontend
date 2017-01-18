export class User {
    constructor(
        public id: string,
        public name: string,
        public identity: string,
        public username: string,
        public email: string,
        public password: string,
        public confirm_code?: string,
        public identity_provider?: string,
        public login_token?: string,
        public credentials?: UserCredentials
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
