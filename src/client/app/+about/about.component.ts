import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded AboutComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css'],
  providers: [AuthenticationService]
})
export class AboutComponent implements OnInit {

  constructor(private auth:AuthenticationService) { }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }
}
