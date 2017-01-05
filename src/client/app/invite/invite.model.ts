export class Invite {
  public changed:boolean =  false;
  constructor(
    public uuid: string,
    public entity_type: string,
    public entity_uuid: string,
    public inviter: string,
    public invitee: string,
    public status: string
  ) {}
}
