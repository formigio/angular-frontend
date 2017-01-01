export class Invite {
  public changed:boolean =  false;
  constructor(
    public uuid: string,
    public goal: string
  ) {}
}
