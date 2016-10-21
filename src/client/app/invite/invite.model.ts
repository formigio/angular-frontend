export class Invite {
  public deleted:boolean =  false;
  constructor(
    public uuid: string,
    public email: string,
    public goal: string
  ) {}
}
