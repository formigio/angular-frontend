export const TaskTemplateStruct = {
      id:'',
      title:'',
      sequence: '',
      goal_template_id: '',
      documentation: '',
      changed: false
    };

export class TaskTemplate {
  constructor(
    public id: string,
    public title: string,
    public sequence: string,
    public goal_template_id: string,
    public documentation: string,
    public changed: boolean
  ) {}
}
