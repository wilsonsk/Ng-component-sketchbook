import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Subscription } from 'rxjs';
import { state, trigger, transition, style, animate, keyframes } from '@angular/animations';

import { RouteNotesComponent } from '../route-notes/route-notes';
import { RoutesProvider } from '../../providers/routes/routes.provider';
import { RouteState } from '../../providers/routes/route-state.model';
import { RouteModel } from '../../models/route.model';

declare var cordova: any;

@Component({
  selector: 'pending-route-list',
  templateUrl: 'pending-route-list.html',
  animations: [
    trigger('expandCard', [
      transition('void => *', [
        style({
          'transform': 'translateY(-25%)',
          'opacity': '0'
        }),
        animate('.1s')
      ]),
      transition('* => void', [
        animate('.1s', style({
          'transform': 'translateY(-15%)',
          'opacity': '0'
        }))
      ]),
    //   transition('void => *', [
    //     animate('0.5s 0s cubic-bezier(0.250, 0.460, 0.450, 0.940)', keyframes([
    //       style({transform: 'translateY(-150px) rotateX(-90deg)', offset: 0}),
    //       style({transform: 'translateY(0) rotateX(0deg)',  offset: 1.0}),
    //     ]))
    //   ]),
    //   transition('* => void', [
    //     animate('0.5s 0s cubic-bezier(0.250, 0.460, 0.450, 0.940)', keyframes([
    //       style({transform: 'translateY(0) rotateX(0deg)', offset: 0}),
    //       style({transform: 'translateY(-150px) rotateX(-90deg)',  offset: 1.0}),
    //     ]))
    //   ]),
    ]),
    trigger('fade', [
      transition('void => *', [
        style({ 'opacity': '0' }),
        animate('0.1s 0.4s')
      ]),
      transition('* => void', [
        animate('0.1s', style({
          'opacity': '0'
        }))
      ])
    ]),
  ]
})
export class PendingRouteListComponent {
  // Subscriptions
  private pendingRoutesChangedSubscription: Subscription;
  private stateChangedSubscription: Subscription;

  // Component States from Routes Provider
  isActive: boolean;

  // Route state
  state: RouteState;

  // Route vars
  currentRoute: RouteModel;
  pendingRoutes: RouteModel[] = [];
  // Image URL needs to reset after each trip type (p and d)
  imagePath = '';

  // Animation only States
  folded: boolean = true;

  routeCardStyle(): Object {
    return {
      backgroundColor: 'gray',
    };
  }

  constructor(public navCtrl: NavController, private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private routesProvider: RoutesProvider, private alertCtrl: AlertController) {
                this.pendingRoutes = this.routesProvider.getPendingRoutes();
                this.state = this.routesProvider.getState();
              }

  ionViewWillEnter() {
    // TESTING HTTP REQUESTS TO DRIVELY REST API
    // this.routesProvider.testHttp()
    //   .subscribe((data) => {
    //     if(data) {
    //       alert(JSON.stringify(data))
    //     }
    //   });

    this.stateChangedSubscription = this.routesProvider.stateChanged.subscribe((stateCopy: RouteState) => {
      this.state = stateCopy;
    });
    this.pendingRoutesChangedSubscription = this.routesProvider.pendingRoutesChanged.subscribe((pendingRoutes: RouteModel[]) => {
      this.pendingRoutes = pendingRoutes;
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

   this.pendingRoutesChangedSubscription.unsubscribe();
  }

  onAcceptCurrentRoute(index: number) {
    this.confirmSelectRoute(index).present();
  }

  private confirmSelectRoute(index: number) {
    const acceptRouteCompleteAlert = this.alertCtrl.create({
      title: 'Are you sure you want to accept this route?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.routesProvider.acceptPendingRoute(index);
          }
        }
      ]
    });
    return acceptRouteCompleteAlert;
  }

  onUnFold() {
    if(this.folded) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    this.folded = !this.folded;
  }
}
