import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { GoogleButtonComponent } from './google-button.component';
import { UserService } from '../user/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [LoginComponent, GoogleButtonComponent],
    exports: [LoginComponent],
    providers: [UserService]
})

export class LoginModule { }
