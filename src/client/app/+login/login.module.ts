import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { GoogleComponent } from './google.component';
import { UserService } from '../user/index';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [LoginComponent, GoogleComponent],
    exports: [LoginComponent],
    providers: [UserService]
})

export class LoginModule { }
