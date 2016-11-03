export class Task {
  [propName: string]: any;
  constructor(
    public uuid: string,
    public goal: string,
    public title: string = '',
    public state_code: string,
    public state_text: string,
    public status_text: string,
    public commitment_text: string,
    public notes?: string
  ) {}

  getWorkState() {
    // Calculate State based on flags
    return 'work_pending';
  }

  getSystemState() {
    // Calculate State based on flags
    return 'pending';
  }

  getTaskState() {
    // Calculate State based on flags
    return 'task_pending';
  }

  done() {
    return (this.getWorkState() === 'work_completed')
  }

  ready() {
    return (this.getSystemState() === 'ready');
  }

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
  - - started    - Worker Marked as work started (Stored Flag, worker marks as started)
  - - paused     - Worker Marked as work paused (Stored Flag, worker marks as paused)
  - - blocked    - Worker Marked as complete (Stored Flag, worker marks as blocked)
  - - completed  - Worker Marked as complete (Stored Flag, worker marks as completed)
  - done               - State Calculated as Done (Derived from Rule - Evaluation of Doneness Rule)


States
  - worker_status      - Worker Status set by Worker, can have 5 possible values




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
|| task_waiting    | queued        | notstarted    ||
|| task_waiting    | queued        | paused        ||
|| task_waiting    | queued        | complete      ||
|| task_waiting    | queued        | blocked       ||
|| task_progress   | queued        | started       ||
|| task_done       | closed        | -             ||

|| Work State      | System Status | Worker Status ||
-----------------------------------------------------
|| work_pending    | queued        | notstarted    ||
|| work_started    | queued        | started       ||
|| work_paused     | queued        | paused        ||
|| work_blocked    | queued        | blocked       ||
|| work_completed  | queued        | completed     ||

*/