import { Component, OnInit } from '@angular/core';
import { MessageService, HelperService } from '../core/index';
import { CommitmentService, Commitment } from './index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'commitment-list',
  directives: [ ],
  templateUrl: 'commitment-list.component.html',
  providers: [ CommitmentService ]
})

export class CommitmentListComponent implements OnInit {

  commitments: Commitment[] = [];

  /**
   *
   * @param
   */
  constructor(
    protected message: MessageService,
    protected helper: HelperService,
    protected service: CommitmentService
  ) {
    this.service = this.helper.getServiceInstance(this.service,'CommitmentService');
  }

 /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.service.getListSubscription().subscribe(
      commitments => {
        this.commitments = <Commitment[]>commitments;
      }
    );
    this.message.startProcess('load_commitments',{});
  }

  refreshCommitments() {
    this.message.startProcess('load_commitments',{});
  }

} // Component end
