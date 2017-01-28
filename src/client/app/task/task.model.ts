export const TaskStruct = {
      id:'',
      goal_id:'',
      title:'',
      sequence: '',
      work_status: 'notstarted',
      system_status: 'pending',
      commitment_worker_id:'',
      commitment_worker_name:'',
      commitment_promised_start:'',
      changed: false
    }

export class Task {
  public changed:boolean =  false;
  constructor(
    public id: string,
    public title: string,
    public sequence: string,
    public goal_id: string,
    public work_status: string,
    public system_status: string,
    public commitment_worker_id: string,
    public commitment_promised_start: string,
    public commitment_worker_name: string
  ) {}

  // getWorkStatus() {
  //   // Calculate State based on flags
  //   return 'work_pending';
  // }

  // getSystemState() {
  //   // Calculate State based on flags
  //   return 'pending';
  // }

  // getTaskState() {
  //   // Calculate State based on flags
  //   return 'task_pending';
  // }

  // done() {
  //   return (this.getWorkStatus() === 'work_completed')
  // }

  // ready() {
  //   return (this.getSystemState() === 'ready');
  // }

}

// Potential Task State Codes
/*

 Possible Statuses
  - system_status      - System Status is set by the Platform, can have 3 possible values
  - - pending   - Default Status
  - - ready     - Required context is set (Ready Rule returns true)
  - - queued    - Claimed by a worker and commitment promised (Derived from Commitment)
  - - closed    - System considers this closable (Done Rule returns true)
  - worker_status      - Worker Status set by Worker, can have 5 possible values
  - - notstarted - Default Status
  - - scheduled  - moved to this state when commitment is saved
  - - started    - Worker Marked as work started (Stored Flag, worker marks as started)
  - - paused     - Worker Marked as work paused (Stored Flag, worker marks as paused)
  - - blocked    - Worker Marked as complete (Stored Flag, worker marks as blocked)
  - - completed  - Worker Marked as complete (Stored Flag, worker marks as completed)
  - done               - State Calculated as Done (Derived from Rule - Evaluation of Doneness Rule)

*/


// States and Status
/*

|| System State | Ready Rule | Commitment | Done Rule ||
--------------------------------------------------------
|| pending      | false      | false      | false     ||
|| ready        | true       | false      | false     ||
|| queued       | true       | true       | false     ||
|| closed       | -          | -          | true      ||

|| Task State      | System Status | Worker Status ||
-----------------------------------------------------
|| task_pending    | pending       | -             ||
|| task_ready      | ready         | -             ||
|| task_waiting    | queued        | pending       ||
|| task_waiting    | queued        | scheduled     ||
|| task_waiting    | queued        | paused        ||
|| task_waiting    | queued        | complete      ||
|| task_waiting    | queued        | blocked       ||
|| task_progress   | queued        | started       ||
|| task_done       | closed        | -             ||

|| Work State      | System Status | Worker Status ||
-----------------------------------------------------
|| work_pending    | queued        | notstarted    ||
|| work_scheduled  | queued        | scheduled     ||
|| work_started    | queued        | started       ||
|| work_paused     | queued        | paused        ||
|| work_blocked    | queued        | blocked       ||
|| work_completed  | queued        | completed     ||

*/