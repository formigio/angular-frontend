export class Goal {
  public changed:boolean =  false;
  constructor(
    public uuid: string,
    public title: string,
    public team: string
  ) {}
}
