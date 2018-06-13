import { Component } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Geolocation } from '@ionic-native/geolocation';

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
  currentLatitude: number;
  currentLongitude: number;
  error:string;

  constructor(private launchNavigator: LaunchNavigator, private geolocation: Geolocation, private nativePageTransitions: NativePageTransitions) {
    this.geolocation.getCurrentPosition().then((resp) => {
     this.currentLatitude = 3;
     this.currentLongitude = 3;
    }).catch((error) => {
      this.error = error.message;
      console.log('Error getting location', error);
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
  }

  openMap() {

    let options: LaunchNavigatorOptions = {
      start: this.currentLatitude + ', ' + this.currentLongitude,
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,

    };

    this.launchNavigator.navigate('45.9387,	-122.6615', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
