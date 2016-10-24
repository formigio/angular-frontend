import { Injectable } from '@angular/core';

/**
 * This class provides the TaskStubService service with methods to read names and add names.
 */
@Injectable()
export class HelperStubService {

    getServiceInstance(service:any,alias:string): any {
        return service;
    }

 }
