import { Component, OnInit } from '@angular/core';
import { GoalService, Goal, TaskService, Task, InviteService, Invite } from '../shared/index';
import { Subscription } from 'rxjs/Subscription';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded GoalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'goal-view',
  templateUrl: 'goal.component.html',
  styleUrls: ['goal.component.css'],
  providers: [ GoalService, TaskService, InviteService ]
})

export class GoalComponent implements OnInit {

  errorMessage: string;
  currentResponse: {};
  goal: Goal;
  tasks: Task[] = [];
  invites: Invite[] = [];
  newTaskTitle: '';
  fullDeleteInitialized: boolean = false;
  task: Task = {
    complete: 'false',
    uuid: '',
    title: '',
    goal: ''
  };
  invite: Invite = {
    uuid: '',
    email: '',
    goal: ''
  };

  private sub: Subscription;

  /**
   * Creates an instance of the GoalComponent with the injected
   * GoalService, Router, and Active Route.
   *
   * @param {GoalService} goalService - The injected GoalService.
   * @param {ActivatedRoute} route - The injected ActivatedRoute.
   * @param {Router} router - The injected Router.
   */
  constructor(
    protected auth: AuthenticationService,
    protected service: GoalService,
    protected taskService: TaskService,
    protected inviteService: InviteService,
    protected route: ActivatedRoute,
    protected router: Router) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
    this.sub = this.route.params.subscribe(params => {
       let id = params['guid'];
       this.service.get(id)
                      .subscribe(
                        goal => this.goal = <Goal>goal,
                        error =>  this.errorMessage = <any>error,
                        () => this.fetchTasksAndInvites()
                        );

     });
  }

  /**
   * Deletes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteGoal(goal:Goal): boolean {

    if(this.tasks.length === 0 && this.invites.length === 0) {
      this.service.delete(goal.guid)
        .subscribe(
          response => this.currentResponse,
          error => this.errorMessage = <any>error,
          () => this.router.navigate(['/'])
        );
    } else {
      this.tasks.forEach((task) => this.deleteTask(task));
      this.invites.forEach((invite) => this.deleteInvite(invite));
    }

    return false;
  }

  goalHasChildren(): boolean {
    return this.tasks.length > 0 || this.invites.length > 0;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  accomplishGoal(goal:Goal): boolean {
    goal.accomplished = 'true';
    this.service.put(goal)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => console.log('Goal Successfully saved.')
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  fetchTasksAndInvites() {
    this.fetchTasks();
    this.fetchInvites();
  }

  fetchTasks() {
    console.log('Getting Tasks for: ' + this.goal.guid);
    this.taskService.list(this.goal.guid)
                .subscribe(
                  tasks => this.tasks = <Task[]>tasks,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Tasks are Fetched')
                  );
  }

  fetchInvites() {
    this.inviteService.list(this.goal.guid)
                .subscribe(
                  invites => this.invites = <Invite[]>invites,
                  error =>  this.errorMessage = <any>error,
                  () => console.log('Invites are Fetched')
                  );
  }

  /**
   * Pushes a new goal onto the goals array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addTask(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.task.goal = this.goal.guid;
    let newTask:Task = {
      complete: 'false',
      uuid: uuid,
      title: this.task.title,
      goal: this.goal.guid
    };
    this.taskService.post(newTask)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.tasks.push(newTask)
      );
    // this.tasks.push(newTask)
    this.task.title = '';
    return false;
  }

  /**
   * Pushes a new invite onto the invites array
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  addInvite(): boolean {
    let uuid = Math.random().toString().split('.').pop();
    this.invite.goal = this.goal.guid;
    let newInvite:Invite = {
      uuid: uuid,
      email: this.invite.email,
      goal: this.goal.guid
    };
    this.inviteService.post(newInvite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.invites.push(newInvite)
      );
    this.invite.email = '';
    return false;
  }


  /**
   * Deletes an invite
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteInvite(invite:Invite): boolean {
    this.inviteService.delete(invite)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.removeInvite(invite)
      );
    return false;
  }

  removeInvite(remove:Invite): boolean {
    let newinvites:Invite[] = [];
    this.invites.forEach((invite) => {
      if(invite.uuid !== remove.uuid) {
        newinvites.push(invite);
      }
    });
    this.invites = newinvites;
    return false;
  }


  /**
   * Deletes a task
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  deleteTask(task:Task): boolean {
    this.taskService.delete(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error,
        () => this.removeTask(task)
      );
    return false;
  }

  removeTask(remove:Task): boolean {
    let newtasks:Task[] = [];
    this.tasks.forEach((task) => {
      if(task.uuid !== remove.uuid) {
        newtasks.push(task);
      }
    });
    this.tasks = newtasks;
    return false;
  }

  /**
   * Puts the Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  saveTask(task:Task): boolean {
    this.taskService.put(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error
      );
    return false;
  }

  /**
   * Puts the accomplished Goal Object to the Goal List Service
   * @return {boolean} false to prevent default form submit behavior to refresh the page.
   */
  completeTask(task:Task): boolean {
    task.complete = 'true';
    this.taskService.put(task)
      .subscribe(
        response => this.currentResponse,
        error => this.errorMessage = <any>error
      );
    return false;
  }

}
