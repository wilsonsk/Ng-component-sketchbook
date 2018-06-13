import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';

import { LocationModel } from '../../models/location.model';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider {
  private location: LocationModel;

  constructor(public http: HttpClient, private geolocation: Geolocation) {}

  initLocation() {
      return this.geolocation.getCurrentPosition();
  }

  getLocation() {
    return this.location;
  }

}
