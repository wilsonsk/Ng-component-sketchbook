import { Component } from '@angular/core';

import { RouteModel } from '../../models/route.model';

/**
 * Generated class for the RoutesListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'routes-list',
  templateUrl: 'routes-list.html'
})
export class RoutesListComponent {
  routes: RouteModel[] = [
    new RouteModel('pickupTime1', 1, 'source1', 'destination1', 'appointmentTime1', true, false),
    new RouteModel('pickupTime2', 2, 'source2', 'destination2', 'appointmentTime2', true, false),
    new RouteModel('pickupTime3', 3, 'source3', 'destination3', 'appointmentTime3', true, false),
    new RouteModel('pickupTime4', 4, 'source4', 'destination4', 'appointmentTime4', true, false),
    new RouteModel('pickupTime5', 5, 'source5', 'destination5', 'appointmentTime5', true, false),
  ];

  constructor() {

  }

}
