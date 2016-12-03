export class User {
    constructor(
        public uuid: string,
        public email: string,
        public password_hash: string,
        public password: string,
        public confirm_code?: string,
        public identity_provider?: string,
        public credentials?: UserCredentials
    ) { }
}

export class UserCredentials {
    constructor(
        public accessKey?: string,
        public secretKey?: string,
        public sessionToken?: string
    ) { }
}
