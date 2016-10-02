import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideFakeRouter } from '../../testing/router/router-testing-providers';

import { GoalsPageComponent } from './index';
import { AuthenticationService } from '../+login/index';

import { LoginStubService } from '../../testing/login/login.service';

export function main() {
   describe('Goals Page component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ FormsModule ],
        declarations: [TestComponent],
        providers: [
          {provide: provideFakeRouter(TestComponent, [{path: 'goal/:guid',component:GoalsPageComponent}])},
          {provide: AuthenticationService, useClass: LoginStubService }
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
  directives: [GoalsPageComponent],
  template: '<goal-page></goal-page>'
})
class TestComponent {}
