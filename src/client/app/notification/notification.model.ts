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
        id: string,
        worker_id: number,
        content: string,
        created_at: string,
        sent_at: string,
        viewed: boolean
    ) {}
}
