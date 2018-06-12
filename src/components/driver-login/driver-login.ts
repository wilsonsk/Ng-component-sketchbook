import { Component } from '@angular/core';

/**
 * Generated class for the DriverLoginComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'driver-login',
  templateUrl: 'driver-login.html'
})
export class DriverLoginComponent {

  text: string;

  constructor() {
    console.log('Hello DriverLoginComponent Component');
    this.text = 'Hello World';
  }

}
