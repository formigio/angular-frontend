export const GoalStruct = {
  id: '',
  title: '',
  description: '',
  team_id: '',
  accomplished: false,
  changed: false
};

export class Goal {
  public changed:boolean =  false;
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public team_id: string,
    public accomplished: boolean
  ) {}
}
