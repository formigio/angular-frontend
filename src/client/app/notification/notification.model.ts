export const NotificationStruct = {
    id: '',
    worker_id: '',
    content: '',
    created_at: '',
    sent_at: '',
    viewed: false
};

export class Notification {
    constructor(
        public id: string,
        public worker_id: string,
        public content: string,
        public created_at: string,
        public sent_at: string,
        public viewed: boolean
    ) {}
}
