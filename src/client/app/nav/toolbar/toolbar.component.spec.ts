import { Component } from '@angular/core';
import {
  async,
  TestBed
} from '@angular/core/testing';

import { ToolbarComponent } from './toolbar.component';

export function main() {
  describe('Toolbar component', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [],
          declarations: [ TestComponent ],
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

    });
}

@Component({
  selector: 'test-cmp',
  directives: [ToolbarComponent],
  template: '<sd-toolbar></sd-toolbar>'
})
class TestComponent {}
