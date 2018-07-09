import { OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult } from '@ionic-native/native-geocoder';
import { Subject } from 'rxjs';
import { Subscription } from 'rxjs';

import { LocationModel } from '../../models/location.model';

@Injectable()
export class LocationProvider implements OnDestroy {
  locationChanged = new Subject<any>();
  private locationChangedSubscription: Subscription;
  private location: LocationModel;

  constructor(public http: HttpClient, private geolocation: Geolocation, private nativeGeocoder: NativeGeocoder) {

  }

  initCoords() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.location = new LocationModel(resp.coords.latitude, resp.coords.longitude, null);
      this.locationChangedSubscription = this.geolocation.watchPosition()
        .filter((p) => p.coords !== undefined) //Filter Out Errors
        .subscribe(pos => {
          this.location = new LocationModel(pos.coords.latitude, pos.coords.longitude, null);
          this.locationChanged.next();
        });
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

  initAddress() {
    return this.nativeGeocoder.reverseGeocode(this.location.latitude, this.location.longitude).then((resp) => {
      this.location.currentAddress = resp[0].thoroughfare + ', ' + resp[0].locality + ', ' + resp[0].administrativeArea + ' ' + resp[0].postalCode;
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
