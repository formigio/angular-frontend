import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';
import { UserService } from '../user/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [LoginComponent,LogoutComponent],
    exports: [LoginComponent,LogoutComponent],
    providers: [UserService]
})

export class LoginModule { }
