export class Goal {
  public changed:boolean =  false;
  constructor(
    public guid: string,
    public title: string,
    public team: string
  ) {}
}
