import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login.component';
import { AuthenticationService } from './login.service';

@NgModule({
    imports: [CommonModule, FormsModule, SharedModule],
    declarations: [LoginComponent],
    exports: [LoginComponent],
    providers: [ AuthenticationService ]
})

export class LoginModule { }
