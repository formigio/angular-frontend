export const NotificationStruct = {
    id: '',
    worker_id: '',
    worker_name: '',
    message: '',
    created_at: '',
    sent_at: '',
    meta_data: {},
    viewed: false
};

export class Notification {
    constructor(
        public id: string,
        public worker_id: string,
        public worker_name: string,
        public message: string,
        public created_at: string,
        public sent_at: string,
        public meta_data: {},
        public viewed: boolean
    ) {}
}
