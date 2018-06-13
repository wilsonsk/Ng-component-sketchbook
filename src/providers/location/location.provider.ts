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
  location: Location;

  constructor(public http: HttpClient, private geolocation: Geolocation) {}

  getLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
     this.location.currentLatitude = resp.coords.latitude;
     this.location.currentLongitude = resp.coords.longitude;
     return this.location;
    }).catch((error) => {
      this.error = error.message;
      console.log('Error getting location', error);
    });
  }

}
