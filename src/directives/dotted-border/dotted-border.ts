import { Directive, HostBinding, Input } from '@angular/core';


@Directive({
  selector: '[dotted-border]' // Attribute selector
})
export class DottedBorderDirective {
  // Even EASIER than Renderer2 - binds a variable to any property of the DOM element the directive is sitting on
  @HostBinding('style.background') bg: string;
  @HostBinding('style.backgroundSize') bgSize: string = '75% 75%';
  @HostBinding('style.backgroundRepeat') bgRepeat: string = 'no-repeat';
  @HostBinding('style.backgroundPosition') bgPos: string = 'center';
  svgPath:string = '';

  @Input() set svgType(type: string = null) {
    this.initSize();
    if(type=='d') {
      this.svgPath = 'assets/svg/dotted_border_alt.svg';
      this.bg = 'url(' + this.svgPath + ')';
    } else if (type=='p'){
      this.svgPath = 'assets/svg/dotted_border.svg';
      this.bg = 'url(' + this.svgPath + ')';
    } else {
      this.svgPath = 'assets/svg/dotted_border_alt.svg';
      this.bg = 'url(' + this.svgPath + ')';
    }


  }

  constructor() {

  }

  initSize() {
    this.bgSize= '75% 75%';
    this.bgRepeat = 'no-repeat';
    this.bgPos = 'center';
  }
}
