import { Component } from '@angular/core';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

/**
 * Generated class for the RouteNavigationComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'route-navigation',
  templateUrl: 'route-navigation.html'
})
export class RouteNavigationComponent {


  constructor(private launchNavigator: LaunchNavigator) {

  }

  openMap() {
    let options: LaunchNavigatorOptions = {
      start: "45.6387,	-122.6615",
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,
      launchModeGoogleMaps: this.launchNavigator.LAUNCH_MODE.TURN_BY_TURN

    };

    this.launchNavigator.navigate('45.9387,	-122.6615', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
