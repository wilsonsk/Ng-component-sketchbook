import { Component } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Subscription } from 'rxjs';

import { LocationModel } from '../../models/location.model';
import { LocationProvider } from '../../providers/location/location.provider';

/**
 * Generated class for the RouteNavigationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'route-navigation',
  templateUrl: 'route-navigation.html',
})
export class RouteNavigationComponent {
  private locationChangedSubscription: Subscription;
  location: LocationModel;
  message:string;

  constructor(private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private locationProvider:LocationProvider) {


  }

  ionViewWillEnter() {
    // locationChangedSubscription needs to be tested
    this.locationChangedSubscription = this.locationProvider.locationChanged.subscribe((loc) => {
      this.location = this.locationProvider.getLocation();
    });

    this.locationProvider.initLocation().then(() => {
      this.location = this.locationProvider.getLocation();
      this.message = JSON.stringify(this.location);
    });
  }

  ionViewWillLeave() {
   let options: NativeTransitionOptions = {
      direction: 'left',
      duration: 500,
      slowdownfactor: 3,
      slidePixels: 20,
      androiddelay: 150,
      fixedPixelsTop: 0,
      fixedPixelsBottom: 60
     };

   this.nativePageTransitions.slide(options);

   this.locationChangedSubscription.unsubscribe();
  }

  openMap() {
    let options: LaunchNavigatorOptions = {
      start: this.location.latitude + ', ' + this.location.longitude,
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,
    };

    // get first param from Drively API
    this.launchNavigator.navigate('45.9387,	-122.6615', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
