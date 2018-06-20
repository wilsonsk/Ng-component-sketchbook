import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteModel } from '../../models/route.model';
import { Subject } from 'rxjs';

@Injectable()
export class RoutesProvider {
  routes: RouteModel[] = [
    new RouteModel('05:50AM', 1, 'source address 1', '1800 NE Alberta St, Portland, OR 97211', '06:40AM', true, false, null),
    new RouteModel('07:20AM', 2, 'source address 2', '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '10:20AM', true, true, null),
    new RouteModel('01:15PM', 3, 'source address 3', '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '02:00PM', false, false, null),
    new RouteModel('03:25PM', 4, 'source address 4', '2211 NE 139th St, Vancouver, WA 98686', '04:20PM', false, false, null),
    new RouteModel('05:50PM', 5, 'source address 5', '700 NE 87th Ave, Vancouver, WA 98664', '07:00PM', true, true, null),
  ];
  currentRoute: RouteModel;
  routesChanged = new Subject<RouteModel[]>();

  constructor(public http: HttpClient) {

  }

  setCurrentRoute(route: RouteModel) {
    this.currentRoute = route;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  getRoutes() {
    return this.routes.slice();
  }

  removeRoute(index: number) {
    this.routes.splice(index,1);
    this.routesChanged.next(this.routes.slice());
  }

}
