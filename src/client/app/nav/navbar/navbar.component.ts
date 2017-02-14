import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../../core/index';
import { User, UserService, UserStruct } from '../../user/index';

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
  public user:User = UserStruct;

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
    this.message.startProcess('navigate_to',{navigate_to:'/'});
  }
}
