import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Subscription } from 'rxjs';

import { LocationModel } from '../../models/location.model';
import { LocationProvider } from '../../providers/location/location.provider';
import { RoutesProvider } from '../../providers/routes/routes.provider';

import { RouteModel } from '../../models/route.model';

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
  currentLocation: LocationModel;
  curLoc:string;
  currentRoute: RouteModel;

  constructor(private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private locationProvider:LocationProvider, private navParams: NavParams, private routesProvider: RoutesProvider) {

  }

  ionViewWillEnter() {
    // locationChangedSubscription needs to be tested
    this.locationChangedSubscription = this.locationProvider.locationChanged.subscribe((loc) => {
      this.currentLocation = this.locationProvider.getLocation();
    });

    this.locationProvider.initLocation().then(() => {
      this.currentLocation = this.locationProvider.getLocation();
      this.currentRoute = this.routesProvider.getCurrentRoute();
      this.curLoc = JSON.stringify(this.currentLocation);
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
      start: this.currentLocation.latitude + ', ' + this.currentLocation.longitude,
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,
    };

    // get first param from Drively API
    this.launchNavigator.navigate(this.currentRoute.destinationAddr, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
