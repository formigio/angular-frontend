export class Invite {
  public changed:boolean =  false;
  constructor(
    public id: string,
    public hash: string,
    public entity: string,
    public entity_id: string,
    public inviter_name: string,
    public invitee_name: string,
    public inviter_worker_id: string,
    public invitee_worker_id: string,
    public status: string
  ) {}
}
