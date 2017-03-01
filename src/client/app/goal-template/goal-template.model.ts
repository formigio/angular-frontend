export const GoalTemplateStruct = {
  id: '',
  title: '',
  documentation: '',
  team_id: '',
  changed: false
};

export class GoalTemplate {
  constructor(
    public id: string,
    public title: string,
    public documentation: string,
    public team_id: string,
    public changed: boolean
  ) {}
}
