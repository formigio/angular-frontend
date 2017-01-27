export class Commitment {
  public changed:boolean = false;
  constructor(
    public id: string,
    public worker_id: string,
    public task_id: string,
    public promised_start: string,
    public promised_minutes: string
  ) {}
}
