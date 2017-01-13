export class Invite {
  public changed:boolean =  false;
  constructor(
    public uuid: string,
    public entityType: string,
    public entity: string,
    public inviter: string,
    public invitee: string,
    public status: string
  ) {}
}
