import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteModel } from '../../models/route.model';

@Injectable()
export class CurrentRouteProvider {
  currentRoute: RouteModel;

  constructor(public http: HttpClient) {

  }

  setCurrentRoute(route: RouteModel) {
    this.currentRoute = route;
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

}
