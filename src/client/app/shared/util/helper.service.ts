import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HelperWorker } from '../index';

@Injectable()
export class HelperService {

    constructor(public router: Router) {}

    getWorker() {
        return new HelperWorker(this);
    }

    sortBy(arr:any[],property:string) {
        arr.sort((a,b) => {
                    if(a[property] < b[property])
                        return -1;
                    if(a[property] > b[property])
                        return 1;
                    return 0;
                    });
    }
}
