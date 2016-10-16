import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './app.routes';

import { CoreModule } from './core/core.module';
import { AboutModule } from './+about/about.module';
import { HomeModule } from './+home/home.module';
import { GoalModule } from './goal/goal.module';
import { TaskModule } from './task/task.module';
import { InviteModule } from './invite/invite.module';
import { GoalPagesModule } from './+goals/goal-pages.module';
import { LoginModule } from './+login/login.module';
import { SharedModule } from './shared/shared.module';
import { NavModule } from './nav/nav.module';
import { MessageService } from './core/index';
import { HelperService } from './shared/index';

@NgModule({
  imports: [
    BrowserModule, HttpModule, routing, CoreModule,
    LoginModule, GoalModule, TaskModule, InviteModule,
    GoalPagesModule, AboutModule, HomeModule, NavModule, SharedModule.forRoot()],
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
