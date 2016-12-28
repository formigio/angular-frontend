import { Component, OnInit } from '@angular/core';
import { MessageService } from '../core/index';

/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'logout',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    public message:MessageService
  ) { }

  ngOnInit() {
      this.message.startProcess('user_logout',{});
  }

}
