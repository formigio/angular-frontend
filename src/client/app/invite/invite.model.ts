export class Invite {
  public changed:boolean =  false;
  constructor(
    public uuid: string,
    public email: string,
    public goal: string
  ) {}
}
