import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { provideFakeRouter } from '../../testing/router/router-testing-providers';

import { HomeComponent } from './index';
import { UserService } from '../user/index';

import { LoginStubService } from '../../testing/login/login.service';

export function main() {
   describe('Home component', () => {

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        providers: [
          {provide: provideFakeRouter(TestComponent, [{path: '',component:HomeComponent}])},
          {provide: UserService, useClass: LoginStubService }
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
  directives: [HomeComponent],
  template: '<sd-home></sd-home>'
})
class TestComponent {}
