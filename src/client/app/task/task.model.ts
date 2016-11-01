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
  - pending_commitment - New Tasks that haven't been claimed (Default State)
  - committed_to - Claimed by a worker and commitment promised (Derived from Commitment)
  - work_started - Worker Marked as work started (Stored Flag, worker marks as started)
  - work_paused - Worker Marked as work paused (Stored Flag, worker marks as paused)
  - work_blocked - Worker Marked as complete (Stored Flag, worker marks as blocked)
  - work_completed - Worker Marked as complete (Stored Flag, worker marks as completed)
  - done - State Calculated as Done (Derived from Rule - Evaluation of Doneness Rule)
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