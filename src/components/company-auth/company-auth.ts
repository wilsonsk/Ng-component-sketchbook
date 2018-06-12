import { Component } from '@angular/core';

/**
 * Generated class for the CompanyAuthComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'company-auth',
  templateUrl: 'company-auth.html'
})
export class CompanyAuthComponent {

  text: string;

  constructor() {
    console.log('Hello CompanyAuthComponent Component');
    this.text = 'Hello World';
  }

}
