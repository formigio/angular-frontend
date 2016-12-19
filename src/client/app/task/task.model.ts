export class Task {
  public changed:boolean =  false;
  constructor(
    public complete: boolean = false,
    public uuid: string,
    public title: string = '',
    public goal: string
  ) {}
}
