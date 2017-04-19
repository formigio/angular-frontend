import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MessageService, HelperService, ProcessRoutine,
  ProcessContext, ProcessTask, WorkerComponent, ProcessTaskRegistration } from '../core/index';
import { User } from '../user/index';
import { Notification, NotificationService } from './index';


@Component({
  moduleId: module.id,
  selector: 'notification-worker',
  template: `<div></div>`,
  providers: [ NotificationService ]
})
export class NotificationWorkerComponent implements OnInit, WorkerComponent {

    public workQueue: ReplaySubject<any> = new ReplaySubject(1);

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
        notification_view: new ProcessRoutine(
            'notification_view',
            'The Process Used for Loading of Notification Entity'
        ),
        notification_fetch_list: new ProcessRoutine(
            'notification_fetch_list',
            'The Process Used to Notifications for the Logged in User'
        )
    };

    public tasks: {} = {
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
        get_user_for_save_notification_complete: new ProcessTask(
            'save_notification',
            'get_user_for_save_notification_complete',
            'notification_save',
            'Save Notification',
            'saveNotification',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_save_notification_complete');
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
        get_user_for_view_notification_complete: new ProcessTask(
            'load_notification',
            'get_user_for_view_notification_complete',
            'notification_view',
            'Load Notification',
            'loadNotification',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_view_notification_complete');
            },
            {uuid:'string', user:'User'}
        ),
        get_user_for_fetch_notifications_complete: new ProcessTask(
            'fetch_notifications',
            'get_user_for_fetch_notifications_complete',
            'notification_fetch_user_notifications',
            'Fetch Notifications',
            'fetchUserNotifications',
            (context:ProcessContext) => {
              return context.hasSignal('get_user_for_fetch_notifications_complete');
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
            context:{params:{notification_saved:notification.id}}
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
          console.log(response);
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

  public loadNotification(control_uuid: string, params: any): Observable<any> {
    let id: string = params.id;
    let user: User = params.user;
    let obs = new Observable((observer:any) => {
      this.service.setUser(user);
      this.service.get(id).then(
        response => {
          this.service.publishNotification(response.data);
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notification Loaded.',
            context:{params:{}}
          });
          observer.complete();
        }
      ).catch(
        error => observer.error({
            control_uuid: control_uuid,
            outcome: 'error',
            message:'Notification Load Failed.',
            context:{params:{}}
        })
      );
    });
    return obs;
  }

  public fetchUserNotifications(control_uuid: string, params: any): Observable<any> {
    let user: User = params.user;
    let loadedNotifications: Notification[];
    let obs = new Observable((observer:any) => {
      this.service.list(user).then((response:any) => {
          loadedNotifications = response.data;
          observer.next({
            control_uuid: control_uuid,
            outcome: 'success',
            message:'Notifications loaded successfully.',
            context:{params:{notifications_loaded:true}}
          });
          this.service.publishNotifications(loadedNotifications);
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