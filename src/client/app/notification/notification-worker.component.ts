import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine,
  ProcessContext, ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
import { User } from '../user/index';
import { Notification, NotificationService, NotificationStruct } from './index';


@Component({
  moduleId: module.id,
  selector: 'notification-worker',
  template: `<div></div>`,
  providers: [ NotificationService ]
})
export class NotificationWorkerComponent implements OnInit, WorkerComponent {

    public workQueue: ReplaySubject<any> = new ReplaySubject();

    public routines: {} = {
        notification_delete: new ProcessRoutine(
            'notification_delete',
            'The Process Used to Control the Deletion of Notifications'
        ),
        notification_save: new ProcessRoutine(
            'notification_save',
            'The Process Used to Control the Saving of Notifications'
        ),
        notification_create: new ProcessRoutine(
            'notification_create',
            'The Process Used to Control the Creating of Notifications'
        ),
        notification_create_from_params: new ProcessRoutine(
            'notification_create_from_params',
            'The Process Used to Control the Creating of Notifications from Params'
        ),
        notification_view: new ProcessRoutine(
            'notification_view',
            'The Process Used for Loading of Notification Entity'
        ),
        notification_fetch_list: new ProcessRoutine(
            'notification_fetch_list',
            'The Process Used to Notifications for the Logged in User'
        ),
        notification_connect: new ProcessRoutine(
            'notification_connect',
            'The Process Used to Connect to the Messaging Socket'
        )
    };

    public tasks: {} = {
        notification_connect_init: new ProcessTask(
            'connect_socket',
            'notification_connect_init',
            'notification_connect',
            'Connect to Message Socket',
            'connectSocket',
            (context:ProcessContext) => {
              return context.hasSignal('notification_connect_init');
            },
            {}
        ),
        notification_create_from_params_init: new ProcessTask(
            'formulate_notification_from_params',
            'notification_create_from_params_init',
            'notification_create_from_params',
            'Formulate Notification from Params',
            'formulateNotification',
            (context:ProcessContext) => {
              return context.hasSignal('notification_create_from_params_init');
            },
            {user:'User',worker_id:'string',content:'string'}
        ),
        formulate_notification_from_params_complete: new ProcessTask(
            'create_notification_from_params',
            'formulate_notification_from_params_complete',
            'notification_create_from_params',
            'Create Notification from Params',
            'createNotification',
            (context:ProcessContext) => {
              return context.hasSignal('formulate_notification_from_params_complete');
            },
            {user:'User',notification:'Notification'}
        ),
        create_notification_from_params_complete: new ProcessTask(
            'notify_socket_of_new_notification',
            'create_notification_from_params_complete',
            'notification_create_from_params',
            'Send Socket Message of New Notifications',
            'notifySocketOfNotifications',
            (context:ProcessContext) => {
              return context.hasSignal('create_notification_from_params_complete');
            },
            {notification:'Notification'}
        ),
        get_user_for_delete_notification_complete: new ProcessTask(
            'delete_notification',
            'get_user_for_delete_notification_complete',
            'notification_delete',
            'Delete Notification',
            'deleteNotification',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_delete_notification_complete');
            },
            {user:'User',notification:'Notification'}
        ),
        get_user_for_notification_save_complete: new ProcessTask(
            'save_notification',
            'get_user_for_notification_save_complete',
            'notification_save',
            'Save Notification',
            'saveNotification',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_notification_save_complete');
            },
            {notification:'Notification',user:'User'}
        ),
        get_user_for_create_notification_complete: new ProcessTask(
            'create_notification',
            'get_user_for_create_notification_complete',
            'notification_create',
            'Create Notification',
            'createNotification',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_create_notification_complete');
            },
            {notification:'Notification'}
        ),
        create_notification_complete: new ProcessTask(
            'notify_socket_of_new_notification_on_create',
            'create_notification_complete',
            'notification_create',
            'Send Socket Message of New Notifications',
            'notifySocketOfNotifications',
            (context:ProcessContext) => {
              return context.hasSignal('create_notification_complete');
            },
            {notification:'Notification'}
        ),
        get_user_for_notification_fetch_list_complete: new ProcessTask(
            'fetch_notifications',
            'get_user_for_notification_fetch_list_complete',
            'notification_fetch_list',
            'Fetch Notifications',
            'fetchUserNotifications',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_notification_fetch_list_complete');
            },
            {user:'User'}
        ),
        save_notification_complete: new ProcessTask(
            'fetch_notifications_after_save',
            'save_notification_complete',
            'notification_save',
            'Fetch Notifications',
            'fetchUserNotifications',
            (context:ProcessContext) => {
              return context.hasSignal('save_notification_complete');
            },
            {user:'User'}
        )
    };

  constructor(
    protected service: NotificationService,
    protected helper: HelperService,
    public message: MessageService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'NotificationService');
  }

  /**
   * Get the OnInit
   */
  ngOnInit() {
    // Subscribe to Worker Registrations
    this.message.getRegistrarQueue().subscribe(
      taskRegistration => {
        if(Object.keys(taskRegistration.tasks).length) {
          Object.values(taskRegistration.tasks).forEach((task:ProcessTask) => {
            task.queue = taskRegistration.queue;
            if(this.routines.hasOwnProperty(task.routine)) {
              let processRoutine = (<any>this.routines)[task.routine];
              processRoutine.tasks.push(task);
            }
          });
        }
      }
    );
    this.message.registerProcessTasks(new ProcessTaskRegistration(this.tasks,this.workQueue));

    // Subscribe to Process Queue
    // Process Tasks based on messages received
    if(Object.keys(this.tasks).length > 0) {
      this.workQueue.subscribe(
        workMessage => {
          // Process Signals
          workMessage.executeMethod(this);
        }
      );
    }
    if(Object.keys(this.routines).length > 0) {
      this.message.getProcessInitQueue().subscribe(
        message => {
          // Process Inits
          message.initProcess(this);
        }
      );
    }
  }

  public connectSocket(control_uuid: string, params: any): Observable<any> {
    let url: string = params.url;
    let obs = new Observable((observer:any) => {
      this.message.connectToSocket(url);
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Socket Connect Initiated.',
        context:{params:{}}
      });
      observer.complete();
    });
    return obs;
  }

  public deleteNotification(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let notification: Notification = params.notification;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.delete(notification.id).then((response:any) => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notification removed.',
            context:{params:{}}
          });
          observer.complete();
          this.service.removeNotification(notification.id);
        }).catch((error:any) => {
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: 'Notification delete failed, We cannot delete a notification that still has goals.',
            context:{
              params:{}
            }
        });
      });
    });
    return obs;
  }

  public saveNotification(control_uuid: string, params: any): Observable<any> {
    let notification: Notification = params.notification;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.put(notification).then(
        response => {
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notification Saved successfully.',
            context:{params:{notification_saved:notification.id,params:{viewed:false}}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
          control_uuid: control_uuid,
          outcome: 'error',
          message:'Error has occured while saving notification.',
          context:{params:{}}
        })
      );
    });
    return obs;
  }

  public formulateNotification(control_uuid: string, params: any): Observable<any> {
    let worker_id: string = params.worker_id;
    let content: string = params.content;
    let notification: Notification = JSON.parse(JSON.stringify(NotificationStruct));
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      notification.content = content;
      notification.worker_id = worker_id;
      notification.user_id = user.worker.id;
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Notification Formed successfully.',
        context:{params:{notification:notification}}
      });
      observer.complete();
    });
    return obs;
  }

  public notifySocketOfNotifications(control_uuid: string, params: any): Observable<any> {
    let notification: Notification = params.notification;
    let obs = new Observable((observer:any) => {
      this.message.sendSocketMessage({process:'notification_fetch_list',params:{params:{viewed:false}},notify:[notification.worker_id]});
      observer.next({
        control_uuid: control_uuid,
        outcome: 'success',
        message:'Notification Formed successfully.',
        context:{params:{notification:notification}}
      });
      observer.complete();
    });
    return obs;
  }

  public createNotification(control_uuid: string, params: any): Observable<any> {
    let notification: Notification = params.notification;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.post(notification).then(
        (response:any) => {
          notification = response.data;
          this.service.addNotification(notification);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notification Created successfully.',
            context:{params:{notification_created:notification.id}}
          });
          observer.complete();
        }).catch((response:any) => {
          observer.error({
           control_uuid: control_uuid,
           outcome: 'error',
           message:'Error has occured while saving notification.',
           context:{params:{}}
          });
        });
    });
    return obs;
  }

  public fetchUserNotifications(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let fetchparams: {} = params.params;
    let loadedNotifications: Notification[];
    let obs = new Observable((observer:any) => {
      this.service.list(user,fetchparams).then((response:any) => {
          loadedNotifications = response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notifications loaded successfully.',
            context:{params:{notifications_loaded:true}}
          });
          if(fetchparams.hasOwnProperty('viewed')) {
            this.service.publishUnviewedNotifications(loadedNotifications);
          } else {
            this.service.publishNotifications(loadedNotifications);
          }
          observer.complete();
        }).catch((error:any) => {
          let message = 'Notifications Load Failed. ('+ error +')';
          observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message: message,
            context:{
              params:{}
            }
        });
      });
    });
    return obs;
  }

}
