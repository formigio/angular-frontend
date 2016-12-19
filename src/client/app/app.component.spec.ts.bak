import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { AppComponent } from './app.component';

import { RouterLinkStubDirective } from '../testing/router/router-stubs';

export function main() {

  describe('App component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [TestComponent, RouterLinkStubDirective],
        providers: []
      });
    });

    it('should build without a problem',
      async( () => {
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
  template: '<sd-app></sd-app>',
  directives: [AppComponent]
})

class TestComponent { }
