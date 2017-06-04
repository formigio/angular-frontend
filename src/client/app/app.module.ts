import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';

import { CoreModule } from './core/core.module';
import { MessageService, HelperService } from './core/index';
import { HomeModule } from './+home/home.module';
import { TeamModule } from './team/team.module';
import { TeamMemberModule } from './team-member/team-member.module';
import { GoalModule } from './goal/goal.module';
import { GoalTemplateModule } from './goal-template/goal-template.module';
import { TaskModule } from './task/task.module';
import { TaskTemplateModule } from './task-template/task-template.module';
import { CommitmentModule } from './commitment/commitment.module';
import { InviteModule } from './invite/invite.module';
import { NotificationModule } from './notification/notification.module';
import { TeamPagesModule } from './+teams/team-pages.module';
import { GoalPagesModule } from './+goals/goal-pages.module';
import { GoalTemplatePagesModule } from './+goal-templates/goal-template-pages.module';
import { TaskPagesModule } from './+tasks/task-pages.module';
import { CommitmentPagesModule } from './+commitments/commitment-pages.module';
import { InvitePagesModule } from './+invites/invite-pages.module';
import { NotificationPagesModule } from './+notifications/notification-pages.module';
import { LoginModule } from './+login/login.module';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { NavModule } from './nav/nav.module';


@NgModule({
  imports: [
    BrowserModule, HttpModule, routing, CoreModule, LoginModule,
    UserModule, TeamModule, TeamMemberModule, GoalModule, TaskModule,
    GoalTemplateModule, TaskTemplateModule, NotificationModule, NotificationPagesModule,
    InviteModule, CommitmentModule, TeamPagesModule, GoalPagesModule, InvitePagesModule,
    CommitmentPagesModule,GoalTemplatePagesModule, TaskPagesModule,
    HomeModule, NavModule, SharedModule.forRoot()],
  declarations: [AppComponent],
  providers: [
    MessageService,
    HelperService,
    appRoutingProviders,
    { provide: APP_BASE_HREF, useValue: '<%= APP_BASE %>' }
  ],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
