import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamMemberService, TeamMember } from './index';
import { MessageService, HelperService } from '../core/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'team-member-notify',
  directives: [ ],
  templateUrl: 'team-member-notify.component.html',
  providers: [ TeamMemberService ]
})

export class TeamMemberNotifyComponent implements OnInit {

  @Output() notify = new EventEmitter();

  members: TeamMember[] = [];
  selectedMembers: string[] = [];

  constructor(
    public service: TeamMemberService,
    public message: MessageService,
    public helper: HelperService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'TeamMemberService');
  }

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription()
          .subscribe(
              members => {
                this.members = members;
                this.selectedMembers = [];
                this.members.forEach((member:TeamMember) => {
                  this.selectedMembers.push(member.id)
                  if(this.selectedMembers.length === this.members.length) {
                    this.notify.emit(this.selectedMembers);
                  }
                });
              }
          );
  }

  selected(member:TeamMember) {
    return this.selectedMembers.indexOf(member.id) !== -1
  }

  updateNotify(member:TeamMember) {
    let loc = this.selectedMembers.indexOf(member.id);
    if(loc >= 0) {
      this.selectedMembers.splice(loc,1);
    } else {
      this.selectedMembers.push(member.id);
    }
    this.notify.emit(this.selectedMembers);
  }

}
