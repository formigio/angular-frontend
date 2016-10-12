export class Task {
  public deleted:boolean =  false;
  constructor(
    public complete: string = 'false',
    public uuid: string,
    public title: string = '',
    public goal: string
  ) {}
}
