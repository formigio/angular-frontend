import { Directive, Input } from '@angular/core';
import { Task } from '../../app/task/index';

@Directive({
  selector: '[task]'
})
export class TaskStubDirective {
  @Input() task: Task;
}
