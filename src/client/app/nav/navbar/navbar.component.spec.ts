import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from './navbar.component';

import { RouterLinkStubDirective } from '../../../testing/router/router-stubs';

export function main() {
  describe('Navbar component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [],
          declarations: [ TestComponent, RouterLinkStubDirective ],
          providers: []
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

    it('should have links',
      async(() => {
        TestBed
          .compileComponents()
          .then(() => {
            let fixture = TestBed.createComponent(TestComponent);
            let linkDes = fixture.debugElement
                .queryAll(By.directive(RouterLinkStubDirective));

            let links = linkDes
                .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);

            expect(links.length).toBe(4, 'should have 4 links');
          });
        }));

    });
}

@Component({
  selector: 'test-cmp',
  directives: [NavbarComponent],
  template: '<sd-navbar></sd-navbar>'
})
class TestComponent {}
