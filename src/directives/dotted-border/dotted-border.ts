import { OnInit, Directive, HostBinding } from '@angular/core';


@Directive({
  selector: '[dotted-border]' // Attribute selector
})
export class DottedBorderDirective implements OnInit{
  // Even EASIER than Renderer2 - binds a variable to any property of the DOM element the directive is sitting on
  @HostBinding('style.backgroundImage') bg: string;
  svgPath = '../../../assets/svg/dotted_border.svg';

  constructor() {

  }

  ngOnInit() {
    this.bg = 'url(' + this.svgPath + ')';
  }

}
