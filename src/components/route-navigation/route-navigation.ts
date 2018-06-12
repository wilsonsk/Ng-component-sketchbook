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
    let options: LaunchNavigatorOptions = {
      start: 'London, ON',
      app: this.launchNavigator.APP.GOOGLE_MAPS
    };

    this.launchNavigator.navigate('Toronto, ON', options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }


}
