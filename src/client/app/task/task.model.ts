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

  getState() {
    // Calculate State based on flags
  }
}

// Potential Task State Codes
/*
  - pending_commitment - New Tasks that haven't been claimed
  - committed_to - Claimed by a worker and commitment promised
  - work_started - Worker Marked as work started
  - work_paused - Worker Marked as work paused
  - work_blocked - Worker Marked as complete
  - work_completed - Worker Marked as complete
  - done - State Calculated as Done
*/


// State Chart
/*

|| State              | Committed | Started | Paused | Blocked | Completed | Done |
|| pending_commitment | N         | -       | -      | -       | N         | N    |
|| committed_to       | Y         | -       | -      | N       | N         | N    |
|| work_started       | Y         | Y       | -      | -       | N         | N    |
|| work_paused        | Y         | Y       | Y      | -       | N         | N    |
|| work_blocked       | Y         | -       | -      | Y       | N         | N    |
|| work_completed     | -         | -       | -      | -       | Y         | N    |
|| done               | -         | -       | -      | -       | -         | Y    |

*/