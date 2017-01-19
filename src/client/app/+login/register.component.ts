import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core/index';
import { User, UserService } from '../user/index';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'registration-form',
  templateUrl: 'register.component.html',
  styleUrls: [],
  providers: [ UserService ]
})
export class RegisterComponent implements OnInit {

  user: User;

  constructor(
    public service:UserService,
    public message:MessageService
  ) { }

  ngOnInit() {
    this.service.enforceAuthentication();
    this.user = this.service.retrieveUser();
  }

  save() {
    this.message.startProcess('user_update',{user:this.user});
  }

}
