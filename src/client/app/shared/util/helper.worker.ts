import { Observable } from 'rxjs/Observable';
import { HelperService } from '../index';

export class HelperWorker {

    constructor(private service: HelperService) {}

  public navigateTo(control_uuid: string, params: any): Observable<any> {
    let navigate_to: string = params.navigate_to;
    let obs = new Observable((observer:any) => {
        this.service.router.navigate([navigate_to]);
      observer.next({control_uuid: control_uuid, outcome: 'success', message:'Goal removed successfully.',context:{params:{}}});
      observer.complete();
    });
    return obs;
  }
}
