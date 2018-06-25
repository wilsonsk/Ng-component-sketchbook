import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteModel } from '../../models/route.model';
import { Subject } from 'rxjs';

import { RouteState } from './route-state.model';

@Injectable()
export class RoutesProvider {
  // Test Route Data
  routes: RouteModel[] = [
    new RouteModel('05:50AM', 1, 'source address 1', '1800 NE Alberta St, Portland, OR 97211', '06:40AM', true, false, null, 'p', null, null, null, null, null),
    new RouteModel('07:20AM', 2, 'source address 2', '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '10:20AM', true, true, null, 'd', null, null, null, null, null),
    new RouteModel('01:15PM', 3, 'source address 3', '8801 NE Hazel Dell Ave, Vancouver, WA 98665', '02:00PM', false, false, null, 'p', null, null, null, null, null),
    new RouteModel('03:25PM', 4, 'source address 4', '2211 NE 139th St, Vancouver, WA 98686', '04:20PM', false, false, null, 'd', null, null, null, null, null),
    new RouteModel('05:50PM', 5, 'source address 5', '700 NE 87th Ave, Vancouver, WA 98664', '07:00PM', true, true, null, 'p', null, null, null, null, null),
    new RouteModel('07:50PM', 5, 'source address 5', '700 NE 87th Ave, Vancouver, WA 98664', '08:30PM', true, true, null, 'd', null, null, null, null, null),
  ];

  // Publically Accessible Vars
  currentRoute: RouteModel;
  routesChanged = new Subject<RouteModel[]>();
  stateChanged = new Subject<RouteState>();

  // Route Component State 'checker'
  canChangeState: boolean;
  canStartRoute: boolean;
  public startingMileagePickupFormHasBeenSubmitted: boolean;

  // Route Component States - NOTE this is not immutable state (ie can be mutated by components)
  public state: RouteState;

  constructor(public http: HttpClient) {
    this.initRouteState();
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

    this.routesChanged.next(this.routes.slice());
  }

  // Restarting the trip cycle - Starting at pickup - so assumes tourType = 'pickup'
  initRouteState() {
    this.startingMileagePickupFormHasBeenSubmitted = false;
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
      false,
      false,
    );
  }

  public getState() {
    let stateCopy: RouteState = Object.assign({}, this.state);
    return stateCopy;
  }

  public setState(prop:string, val:any) {
    if(prop === 'startingMileagePickUpAccessible' && val === true) {
      this.startingMileagePickupFormHasBeenSubmitted = true;
    } else if(prop === 'dropOffDidEnd' && val === true) {
      this.startingMileagePickupFormHasBeenSubmitted = false;
    }

    this.state[prop] = val;
    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

  public updateState() {
    if(this.currentRoute.type === 'p') {
      this.initRouteState();
      setTimeout(() => {
        this.setState('startingMileagePickUpAccessible', true);
      }, 1000);
    } else if(this.currentRoute.type === 'd') {
      this.state.numRoutes = this.routes.length;
      this.state.routeTypeState = this.currentRoute.type;
      setTimeout(() => {
        this.setState('pickupDidEnd', true);
      }, 1000);
    }

    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

  public startRoute(reOpen:boolean) {
    if(this.state.routeTypeState==='p') {
      if(!reOpen) {
        this.state.pickupDidStart = true;
      }
      this.state.pickupCanEnd = true;
    } else {
      if(!reOpen) {
        this.state.dropOffDidStart = true;
      }
      this.state.dropOffCanEnd = true;
    }
    let stateCopy: RouteState = Object.assign({}, this.state);
    this.stateChanged.next(stateCopy);
  }

}
