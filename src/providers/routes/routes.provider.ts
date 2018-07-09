import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteModel } from '../../models/route.model';
import { Subject } from 'rxjs';

import { RouteState } from './route-state.model';

@Injectable()
export class RoutesProvider {
  // Test Route Data
  routes: RouteModel[] = [
    new RouteModel('05:50AM', 1, '1800 NE Alberta St, Portland, OR 97211', '06:40AM', true, false, null, 'p', null, null, null, null, null),
    new RouteModel('07:20AM', 2, '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '10:20AM', true, true, null, 'd', null, null, null, null, null),
    new RouteModel('01:15PM', 3, '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '02:00PM', false, false, null, 'p', null, null, null, null, null),
    new RouteModel('03:25PM', 4, '2211 NE 139th St, Vancouver, WA 98686', '04:20PM', false, false, null, 'd', null, null, null, null, null),
    new RouteModel('05:50PM', 5, '700 NE 87th Ave, Vancouver, WA 98664', '07:00PM', true, true, null, 'p', null, null, null, null, null),
    new RouteModel('07:50PM', 6, '700 NE 87th Ave, Vancouver, WA 98664', '08:30PM', true, true, null, 'd', null, null, null, null, null),
  ];

  // Publically Accessible Vars
  currentRoute: RouteModel;
  routesChanged = new Subject<RouteModel[]>();
  stateChanged = new Subject<RouteState>();

  // Route Component State 'checker'
  canChangeState: boolean;
  canStartRoute: boolean;

  // Route Component States - NOTE this is not immutable state (ie can be mutated by components)
  private state: RouteState;

  constructor(public http: HttpClient) {
    this.initRouteState();
  }

  testHttp() {
    // let headers = new HttpHeaders().set('Content-Type', 'application/json');
    //                             // .append('Authorization', token);
    // const options = {
    //   headers: headers
    // };
    return this.http.get('http://ua/drively/sites/_public/schedule/jsonexp.php');
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

  removeRoute() {
    this.routes.splice(0,1);
    this.currentRoute = this.routes[0];

    if(this.routes.length == 0) {
      this.setState('numRoutes', this.routes.length);
    } else {
      this.routesChanged.next(this.routes.slice());
    }
  }

  // Restarting the trip cycle - Starting at pickup - so assumes tourType = 'pickup'
  initRouteState() {
    this.currentRoute = this.routes[0];
    this.state = new RouteState(
      this.routes.length,
      this.currentRoute.type,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      false,
      true,
    );
    if(this.state.routeType==='p') {
      this.setState('startingMileageFormAccessible', false);
      this.setState('startingMileageFormHasBeenSubmitted', true);
      this.setState('tripCanStart', true);
    }
  }

  public getState() {
    let stateCopy: RouteState = Object.assign({}, this.state);
    return stateCopy;
  }

  public setState(prop:string, val:any) {
    // alert('called ' + prop + " " + val)
    // alert(JSON.stringify(this.state))
    this.state[prop] = val;
    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

  // Called at end of every trip (ie when a route is removed and the component is rerendered)
  public updateState() {
    if(!this.state.startingMileageFormHasBeenSubmitted) {
      this.initRouteState();
      if(this.state.routeType==='d') {
        setTimeout(() => {
          this.setState('startingMileageFormAccessible', true);
        }, 1000);
      }
    }

    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

  public startRoute(reOpen:boolean) {
    if(!reOpen) {
      this.state.tripDidStart = true;
    }
    this.state.tripCanEnd = true;

    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

}
