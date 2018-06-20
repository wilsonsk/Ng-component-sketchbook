import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Subscription } from 'rxjs';

import { RouteNotesComponent } from '../route-notes/route-notes';

import { LocationProvider } from '../../providers/location/location.provider';
import { RoutesProvider } from '../../providers/routes/routes';

import { RouteModel } from '../../models/route.model';
import { LocationModel } from '../../models/location.model';

@Component({
  selector: 'routes-list',
  templateUrl: 'routes-list.html'
})
export class RoutesListComponent {
  isActive:boolean;
  private locationChangedSubscription: Subscription;
  private routesChangedSubscription: Subscription;
  currentLocation: LocationModel;
  routes: RouteModel[] = [];
  numRoutes: number;
  folded: boolean = true;
  currentRoute: RouteModel;
  arrivedAtPickup: boolean = false;
  arrivedAtDropoff: boolean = false;

  constructor(public navCtrl: NavController, private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private locationProvider:LocationProvider, private routesProvider: RoutesProvider, private alertCtrl: AlertController,
              private toastCtrl: ToastController) {
                  this.routes = this.routesProvider.getRoutes();
                  this.currentRoute = this.routes[0];
                  this.numRoutes = this.routes.length;
              }

  ionViewWillEnter() {
    this.routesChangedSubscription = this.routesProvider.routesChanged.subscribe((routes: RouteModel[]) => {
      this.routes = routes;
      this.currentRoute = this.routes[0];
      this.numRoutes = this.routes.length;
    });


    // locationChangedSubscription needs to be tested
    this.locationChangedSubscription = this.locationProvider.locationChanged.subscribe((loc) => {
      this.currentLocation = this.locationProvider.getLocation();
    });

    this.locationProvider.initLocation().then(() => {
      this.currentLocation = this.locationProvider.getLocation();
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

  // onGetRoute(route: RouteModel) {
  //   this.currentRouteProvider.setCurrentRoute(route);
  //   this.navCtrl.setRoot(RouteNavigationComponent);
  // }

  onStartPickup() {
    this.routesProvider.setCurrentRoute(this.currentRoute);

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

  onArrivedAtPickup() {
    this.confirmPickUpComplete().present();
  }

  onOpenRouteNotes() {
    this.routesProvider.setCurrentRoute(this.currentRoute);
    this.navCtrl.push(RouteNotesComponent);
  }

  onUnFold() {
    this.routesProvider.setCurrentRoute(this.currentRoute);

    if(this.folded) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    this.folded = !this.folded;
  }

  private confirmPickUpComplete() {
    const pickUpCompleteAlert = this.alertCtrl.create({
      title: 'Is your pickup really complete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            // this.routesProvider.removeRoute();
            this.arrivedAtPickup = true;
          }
        }
      ]
    });
    return pickUpCompleteAlert;
  }

}
