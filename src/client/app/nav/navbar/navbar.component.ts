import { Component } from '@angular/core';

/**
 * This class represents the navigation bar component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.css']
})

export class NavbarComponent {

  open:boolean = false;

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
}
