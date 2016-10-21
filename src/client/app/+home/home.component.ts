import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../+login/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})

export class HomeComponent implements OnInit {

  /**
   * Creates an instance of the HomeComponent with the injected
   * GoalListService.
   *
   * @param {GoalListService} goalListService - The injected GoalListService.
   */
  constructor(
    public auth: AuthenticationService
  ) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.auth.enforceAuthentication();
  }

}
