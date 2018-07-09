import { Component } from '@angular/core';

@Component({
  selector: 'pending-route-list',
  templateUrl: 'pending-route-list.html'
})
export class PendingRouteListComponent {

  text: string;

  constructor() {
    console.log('Hello PendingRouteListComponent Component');
    this.text = 'Hello World';
  }

}
