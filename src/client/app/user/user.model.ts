export class User {
    constructor(
        public uuid: string,
        public email: string,
        public password_hash: string,
        public password: string,
        public confirm_code?: string) { }
}
