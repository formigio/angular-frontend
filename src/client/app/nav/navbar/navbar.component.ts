import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../../core/index';
import { User, UserService } from '../../user/index';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit {

  open:boolean = false;
  public user:User;

  constructor(
    public message:MessageService,
    public helper:HelperService,
    public userService:UserService
  ) {
    this.userService = this.helper.getServiceInstance(this.userService,'UserService');
  }

  ngOnInit() {
    this.userService.getItemSubscription().subscribe(
      user => this.user = user
    );
    this.message.startProcess('user_load_for_app',{});
  }

  toggle() {
    if(this.open === true) {
      this.open = false;
    } else {
      this.open = true;
    }
  }

  close() {
    this.open = false;
  }

  logout() {
    this.message.startProcess('user_logout',{});
    this.close();
  }
}
