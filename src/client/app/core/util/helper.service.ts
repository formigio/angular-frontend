import { Injectable } from '@angular/core';

export class AppState {
    constructor(
        public state: any,
        public services: any
    ) {}
}

@Injectable()
export class HelperService {

    instance: string;

    public runtimestorage: AppState = {
        state: {},
        services: {}
    };

    constructor() {
        this.instance = Math.random().toString().split('.').pop();
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

    getServiceInstance(service:any,alias:string): any {
        if(!this.runtimestorage.services.hasOwnProperty(alias)) {
            this.runtimestorage.services[alias] = service;
        }
        return this.runtimestorage.services[alias];
    }

    getAppState(location:string): any {
        if(<any>this.runtimestorage.state.hasOwnProperty(location)) {
            return this.runtimestorage.state[location];
        }
    }

    setAppState(location:string,value:any): boolean {
        this.runtimestorage.state[location] = value;
        return true;
    }

}
