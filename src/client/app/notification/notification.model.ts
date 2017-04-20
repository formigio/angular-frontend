export const NotificationStruct = {
    id: '',
    worker_id: '',
    worker_name: '',
    user_id: '',
    user_name: '',
    content: '',
    created_at: '',
    sent_at: '',
    viewed: false
};

export class Notification {
    constructor(
        public id: string,
        public worker_id: string,
        public worker_name: string,
        public user_id: string,
        public user_name: string,
        public content: string,
        public created_at: string,
        public sent_at: string,
        public viewed: boolean
    ) {}
}
