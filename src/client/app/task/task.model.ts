export class Task {
  constructor(
    public complete: string = 'false',
    public uuid: string,
    public title: string = '',
    public goal: string
  ) {}
}
