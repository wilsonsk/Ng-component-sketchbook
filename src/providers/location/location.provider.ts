import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { LocationModel } from '../../models/location.model';

/*
  Generated class for the LocationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationProvider implements OnDestroy {
  locationChanged = new Subject<any>();
  private locationChangedSubscription: Subscription;
  private location: LocationModel;

  constructor(public http: HttpClient, private geolocation: Geolocation) {
    this.locationChangedSubscription = this.geolocation.watchPosition()
      .filter((p) => p.coords !== undefined) //Filter Out Errors
      .subscribe(resp => {
        this.location = new LocationModel(resp.coords.latitude, resp.coords.longitude);
        this.locationChanged.next();
      });
  }

  initLocation() {
      return this.geolocation.getCurrentPosition().then((resp) => {
      this.location = new LocationModel(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  getLocation() {
    return this.location;
  }

  ngOnDestroy() {
    this.locationChangedSubscription.unsubscribe();
  }

}
