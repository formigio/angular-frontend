export class Task {
  public changed:boolean =  false;
  constructor(
    public id: string,
    public title: string,
    public sequence: string,
    public goal_id: string,
    public worker_status: string,
    public system_status: string
  ) {}
}
