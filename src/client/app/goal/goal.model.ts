export class Goal {
  public changed:boolean =  false;
  constructor(
    public id: string,
    public title: string,
    public team_id: string
  ) {}
}
