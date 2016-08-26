import { Component } from '@angular/core';
import { List } from './list';

@Component({
    selector: 'list-form',
    templateUrl: 'app/list-form.component.html'
})
export class ListFormComponent {
    model = new List('123kjl123','Get the Job Done');
    submitted = false;
    message = 'You have submitted the form.';
    active = true;

    onSubmit() { this.submitted = true; }

    emptyList() {
        this.model = new List('', '');
        this.active = false;
        setTimeout(() => this.active = true, 0);
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }
}