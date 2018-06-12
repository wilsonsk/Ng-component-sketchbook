import { Component } from '@angular/core';

/**
 * Generated class for the RouteNavigationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'route-navigation',
  templateUrl: 'route-navigation.html'
})
export class RouteNavigationComponent {

  text: string;

  constructor() {
    console.log('Hello RouteNavigationComponent Component');
    this.text = 'Hello World';
  }

}
