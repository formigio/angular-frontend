import { Task } from '../task/index';
import { Goal } from '../goal/index';

export class Commitment {
  constructor(
    public when: string, // Timedate
    public hours: string, // Float
    public task_doc: Task,
    public goal_doc: Goal
  ) {}
}
