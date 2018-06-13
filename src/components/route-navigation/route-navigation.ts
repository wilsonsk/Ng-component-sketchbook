import { Component } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Geolocation } from '@ionic-native/geolocation';
import { AlertController } from 'ionic-angular';

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
  a = this.alertCtrl.create({
    title: 'getCrruentPosition.then() was called' + resp.coords,
    buttons: ['OK']
  });
  b = this.alertCtrl.create({
    title: 'error caught',
    buttons: ['OK']
  });

  constructor(private launchNavigator: LaunchNavigator, private geolocation: Geolocation,
              private nativePageTransitions: NativePageTransitions, private alertCtrl: AlertController) {

    this.geolocation.getCurrentPosition().then((resp) => {
      this.a.present();
     this.currentLatitude = resp.coords.latitude;
     this.currentLongitude = resp.coords.longitude;
    }).catch((error) => {
      this.b.present();
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
