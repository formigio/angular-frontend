export const TeamStruct = {
  id: '',
  title: '',
  changed: false
};

export class Team {
  changed: boolean = false;
  constructor(
    public id: string,
    public title: string
  ) {}
}
