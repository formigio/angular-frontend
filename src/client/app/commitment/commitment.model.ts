import { Task, TaskStruct } from '../task/index';

export const CommitmentStruct = {
    id: '',
    task_id: '',
    worker_id: '',
    promised_start: '',
    promised_minutes: '',
    changed: false,
    task: TaskStruct
  };

export class Commitment {
  public changed:boolean = false;
  constructor(
    public id: string,
    public worker_id: string,
    public task_id: string,
    public promised_start: string,
    public promised_minutes: string,
    public task: Task
  ) {}
}
