import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Goal, GoalService } from './index';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/**
 * This class provides the NameList service with methods to read names and add names.
 */
export class GoalWorker {

  /**
   * Creates a new NameListService with the injected Http.
   * @param {Http} http - The injected Http.
   * @constructor
   */
  constructor(private service: GoalService) {}

  public removeGoal(control_uuid: string, params: any): Observable<any> {
    let goal: string = params.goal;
    let taskCount: number = params.task_count;
    let obs = new Observable((observer:any) => {
      if(taskCount > 0){
        observer.error({control_uuid: control_uuid, outcome: 'error', message:'You can only delete a goal, when it is empty. taskCount:' + taskCount,context:{params:{}}});
      } else {
        this.service.delete(goal).subscribe(
          null,
          error => observer.error({control_uuid: control_uuid, outcome: 'error', message:'An error has occured during Goal delete',context:{params:{}}}),
          () => {
            observer.next({control_uuid: control_uuid, outcome: 'success', message:'Goal removed successfully.',context:{params:{navigate_to:'/goals'}}});
            observer.complete();
          }
        );
      }
    });
    return obs;
  }

}
