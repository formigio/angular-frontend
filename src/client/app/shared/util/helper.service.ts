import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Injectable()
export class HelperService {

    public runtimestorage: {} = {};

    constructor(public router: Router, public route: ActivatedRoute) {}

    sortBy(arr:any[],property:string) {
        arr.sort((a,b) => {
                    if(a[property] < b[property])
                        return -1;
                    if(a[property] > b[property])
                        return 1;
                    return 0;
                    });
    }

    getServiceInstance(service:any,alias:string): any {
        if(!this.runtimestorage.hasOwnProperty('services')) {
            this.runtimestorage = {services:{}};
        }
        if(!(<any>this.runtimestorage)['services'].hasOwnProperty(alias)) {
            (<any>this.runtimestorage)['services'][alias] = service;
        }
        return (<any>this.runtimestorage)['services'][alias];
    }

}
