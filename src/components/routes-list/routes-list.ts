import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RouteNavigationComponent } from '../route-navigation/route-navigation';
import { CurrentRouteProvider } from '../../providers/current-route/current-route';

import { RouteModel } from '../../models/route.model';

@Component({
  selector: 'routes-list',
  templateUrl: 'routes-list.html'
})
export class RoutesListComponent {
  routes: RouteModel[] = [
    new RouteModel('05:50AM', 1, 'source1', '45.9387,	-122.6615', 'appointmentTime1', true, false),
    new RouteModel('07:20AM', 2, 'source2', '46.9387,	-122.6615', 'appointmentTime2', true, false),
    new RouteModel('01:15PM', 3, 'source3', '47.9387,	-122.6615', 'appointmentTime3', true, false),
    new RouteModel('03:25PM', 4, 'source4', '48.9387,	-122.6615', 'appointmentTime4', true, false),
    new RouteModel('05:50PM', 5, 'source5', '49.9387,	-122.6615', 'appointmentTime5', true, false),
  ];
  numRoutes: number;

  constructor(public navCtrl: NavController, private currentRouteProvider: CurrentRouteProvider) {
    this.numRoutes = this.routes.length;
  }

  onGetRoute(route: RouteModel) {
    this.currentRouteProvider.setCurrentRoute(route);
    this.navCtrl.setRoot(RouteNavigationComponent);
  }

}
