import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { state, trigger, transition, style, animate, keyframes } from '@angular/animations';

import { Camera } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

import { RouteNotesComponent } from '../route-notes/route-notes';

import { LocationProvider } from '../../providers/location/location.provider';
import { RoutesProvider } from '../../providers/routes/routes.provider';
import { RouteState } from '../../providers/routes/route-state.model';

import { RouteModel } from '../../models/route.model';
import { LocationModel } from '../../models/location.model';

declare var cordova: any;

@Component({
  selector: 'routes-list',
  templateUrl: 'routes-list.html',
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
export class RoutesListComponent {
  // Subscriptions
  private locationChangedSubscription: Subscription;
  private routesChangedSubscription: Subscription;
  private stateChangedSubscription: Subscription;

  // Component States from Routes Provider
  isActive: boolean;

  // Route state
  state: RouteState;

  // Route vars
  currentRoute: RouteModel;
  currentLocation: LocationModel;
  routes: RouteModel[] = [];
  // Image URL needs to reset after each trip type (p and d)
  imagePath = '';

  // Animation only States
  folded: boolean = true;

  // Reactive form vars
  pickupNotesForm: FormGroup;
  startingMileageForm: FormGroup;
  endingMileageForm: FormGroup;

  constructor(public navCtrl: NavController, private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private locationProvider:LocationProvider, private routesProvider: RoutesProvider, private alertCtrl: AlertController,
              private camera: Camera, private toastCtrl: ToastController, private file: File) {
                this.routes = this.routesProvider.getRoutes();
                this.currentRoute = this.routesProvider.getCurrentRoute();

                this.state = this.routesProvider.getState();
              }

  ionViewWillEnter() {
    // TESTING HTTP REQUESTS TO DRIVELY REST API
    this.routesProvider.testHttp()
      .subscribe((data) => {
        if(data) {
          alert(JSON.stringify(data))
        }
      });

    this.routesChangedSubscription = this.routesProvider.routesChanged.subscribe((routes: RouteModel[]) => {
      this.routes = this.routesProvider.getRoutes();
      this.currentRoute = this.routesProvider.getCurrentRoute();
      this.routesProvider.updateState();
    });
    this.stateChangedSubscription = this.routesProvider.stateChanged.subscribe((stateCopy: RouteState) => {
      this.state = stateCopy;
    });
    // locationChangedSubscription needs to be tested
    this.locationChangedSubscription = this.locationProvider.locationChanged.subscribe((loc) => {
      this.currentLocation = this.locationProvider.getLocation();
    });
    this.locationProvider.initCoords().then(() => {
      this.locationProvider.initAddress().then(() => {
        this.currentLocation = this.locationProvider.getLocation();
      });
    });
    this.initPickupNotesForm();
    this.initStartingMileageForm();
    this.initEndingMileageForm();

    if(!this.state.startingMileageFormHasBeenSubmitted) {
      this.routesProvider.setState('startingMileageFormAccessible', true);
    }
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
   this.routesChangedSubscription.unsubscribe();
   this.stateChangedSubscription.unsubscribe();
  }

  onUnFold() {
    if(this.folded) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    this.folded = !this.folded;
  }

  onStartRoute(reOpen:boolean) {
    this.routesProvider.startRoute(reOpen);

    let options: LaunchNavigatorOptions = {
      start: this.currentLocation.latitude + ', ' + this.currentLocation.longitude,
      app: this.launchNavigator.APP.GOOGLE_MAPS,
      transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,
    };

    // get coords (ie first param) from Drively API
    this.launchNavigator.navigate(this.currentRoute.destinationAddr, options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

  onPickupComplete() {
    this.confirmPickupComplete().present();
  }

  onDropOffComplete() {
    this.confirmDropOffComplete().present();
  }

  onTripComplete() {
    if(this.state.routeType==='p') {
      this.confirmPickupComplete().present();
    } else {
      this.confirmDropOffComplete().present();
    }
  }

  onOpenRouteNotes() {
    this.navCtrl.push(RouteNotesComponent);
  }

  private confirmPickupComplete() {
    const pickupCompleteAlert = this.alertCtrl.create({
      title: 'Please confirm you have arrived at your pickup location?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            // this.routesProvider.setState('endingMileageFormAccessible', true);
            this.routesProvider.setState('tripCanStart', false);
            this.routesProvider.setState('tripCanEnd', false);

            this.routesProvider.setState('tripDidStart', false);
            this.routesProvider.setState('tripCanStart', false);
            this.routesProvider.setState('pickNotesFormAccessible', true);
          }
        }
      ]
    });
    return pickupCompleteAlert;
  }

  private confirmDropOffComplete() {
    const dropOffCompleteAlert = this.alertCtrl.create({
      title: 'Is your drop off really complete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.routesProvider.setState('endingMileageFormAccessible', true);
            this.routesProvider.setState('tripCanStart', false);
            this.routesProvider.setState('tripCanEnd', false);
          }
        }
      ]
    });
    return dropOffCompleteAlert;
  }

  initPickupNotesForm() {
    let additionalPassengers: boolean = false;
    let noShow: boolean = false;
    let cancellation: boolean = false;

    this.pickupNotesForm = new FormGroup({
      'additionalPassengers': new FormControl(additionalPassengers),
      'noShow': new FormControl(noShow),
      'cancellation': new FormControl(cancellation),
    });
  }

  initStartingMileageForm() {
    let startingMileage: string = null;

    this.startingMileageForm = new FormGroup({
      'startingMileage': new FormControl(startingMileage, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    });
  }

  initEndingMileageForm() {
    let endingMileage: string = null;

    this.endingMileageForm = new FormGroup({
      'endingMileage': new FormControl(endingMileage, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
    });
  }

  onOpenCamera() {
    this.camera.getPicture({
      correctOrientation: true,
    })
      .then((imageData) => {
        // imageData depends on save destination type
        console.log(imageData);
        const currentName = imageData.replace(/^.*[\\\/]/, '');
        const path = imageData.replace(/[^\/]*$/, '');
        const newFileName = new Date().getUTCMilliseconds() + '.jpg';
        // cordova.file.dataDirectory == folder for this app on the specific platform/device where you can store files permanently
        // File.moveFile(sourcePath, sourceFileName, destinationPath, destinationFileName)
        this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
          .then((data: Entry) => {
            this.imagePath = data.nativeURL;
          })
          .catch((error: FileError) => {
            this.imagePath = '';
            const toast = this.toastCtrl.create({
              message: 'Could not save image. Please try again',
              duration: 2500
            });
            toast.present();
            // Cleanup renames each file same name - must set new file name,'newFileName'
            this.camera.cleanup();
            // OR
            // File.removeFile(path, currentName);
          });
        this.imagePath = imageData;
      })
      .catch((error) => {
        const toast = this.toastCtrl.create({
          message: 'Could not take photo. Please try again',
          duration: 2500
        });
        toast.present();
        this.camera.cleanup();
      });
  }

  onSubmitStartingMileageForm() {
    this.currentRoute.startingMileage = this.startingMileageForm.value['startingMileage'];
    this.startingMileageForm.reset();

    this.routesProvider.setState('startingMileageFormAccessible', false);
    this.routesProvider.setState('startingMileageFormHasBeenSubmitted', true);
    this.routesProvider.setState('tripCanStart', true);
  }

  onSubmitEndingMileageForm() {
    this.currentRoute.endingMileage = this.endingMileageForm.value['endingMileage'];
    this.endingMileageForm.reset();

    this.routesProvider.setState('endingMileageFormAccessible', false);
    this.routesProvider.setState('tripDidStart', false);
    this.routesProvider.setState('tripCanStart', false);

    if(this.state.routeType==='p') {
      this.routesProvider.setState('pickNotesFormAccessible', true);
    } else if (this.state.routeType==='d'){
      this.routesProvider.setState('tripCanEnd', true);
      this.routesProvider.setState('startingMileageFormHasBeenSubmitted', false);
      this.routesProvider.removeRoute();
      setTimeout(() => {
        this.routesProvider.setState('tripDidEnd', true);
      }, 1000);
    }
  }

  onSubmitPickupNotes() {
    this.currentRoute.additionalPassengers = this.pickupNotesForm.value['additionalPassengers'];
    this.currentRoute.noShow = this.pickupNotesForm.value['noShow'];
    this.currentRoute.cancellation = this.pickupNotesForm.value['cancellation'];
    this.pickupNotesForm.reset();
    this.imagePath = '';

    this.routesProvider.setState('pickNotesFormAccessible', false);
    this.routesProvider.setState('tripCanEnd', true);
    this.routesProvider.setState('startingMileageFormHasBeenSubmitted', false);

    this.routesProvider.removeRoute();
    setTimeout(() => {
      this.routesProvider.setState('tripDidEnd', true);
    }, 1000);
  }
}
