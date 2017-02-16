import { Task, TaskStruct } from '../task/index';
import { Goal, GoalStruct } from '../goal/index';
import { Team, TeamStruct } from '../team/index';
import { UserWorker, UserWorkerStruct } from '../user/index';

export const CommitmentStruct = {
    id: '',
    task_id: '',
    worker_id: '',
    promised_start: '',
    promised_minutes: '',
    changed: false,
    task: TaskStruct,
    goal: GoalStruct,
    team: TeamStruct,
    worker: UserWorkerStruct
  };

export class Commitment {
  public changed:boolean = false;
  constructor(
    public id: string,
    public worker_id: string,
    public task_id: string,
    public promised_start: string,
    public promised_minutes: string,
    public task: Task,
    public goal: Goal,
    public team: Team,
    public worker: UserWorker
  ) {}
}
