import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideFakeRouter } from '../../testing/router/router-testing-providers';
import { HTTP_PROVIDERS } from '@angular/http';

import { TaskListComponent, TaskService } from './index';

import { TaskStubService } from '../../testing/task/task.service';
import { TaskStubDirective } from '../../testing/task/task.directive';

export function main() {
  describe('Task List component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [ FormsModule ],
          declarations: [ TestComponent, TaskStubDirective ],
          providers: [
              provideFakeRouter(TestComponent, [{path: 'goal',component:TaskListComponent}]),
              HTTP_PROVIDERS,
              {provide: TaskService, useClass: TaskStubService }
            ]
      });
    });

    it('should build',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let compiled = fixture.nativeElement;
            expect(compiled).toBeTruthy();
          });
        }));

    });
}

@Component({
  selector: 'test-cmp',
  directives: [TaskListComponent],
  template: '<task-list></task-list>'
})
class TestComponent {}
