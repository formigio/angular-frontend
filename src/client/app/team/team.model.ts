export class Team {
  isDeleted: boolean = false;
  isNew: boolean = true;
  constructor(
    public uuid: string,
    public title: string,
    public identity: string
  ) {}
}
