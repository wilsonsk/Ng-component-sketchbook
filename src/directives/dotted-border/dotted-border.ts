import { OnInit, Directive, HostBinding } from '@angular/core';


@Directive({
  selector: '[dotted-border]' // Attribute selector
})
export class DottedBorderDirective implements OnInit{
  // Even EASIER than Renderer2 - binds a variable to any property of the DOM element the directive is sitting on
  @HostBinding('style.background') bg: string;

  constructor() {

  }

  ngOnInit() {
    this.bg = "url(../../../assets/svg/dotted_border.svg)";
  }

}
