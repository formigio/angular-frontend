import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[routerLink]'
})
export class RouterLinkStubDirective {
  navigatedTo: any = null;
  @Input() routerLink: any;
  @HostListener('click', ['$event.target']) onClick() {
    this.navigatedTo = this.routerLink;
  }
}
