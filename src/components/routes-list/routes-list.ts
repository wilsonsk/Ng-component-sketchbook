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
  imageUrl = '';

  // Animation only States
  folded: boolean = true;

  // Reactive form vars
  pickupNotesForm: FormGroup;
  startingMileagePickupForm: FormGroup;
  endingMileagePickupForm: FormGroup;

  startingMileageDropOffForm: FormGroup;
  endingMileageDropOffForm: FormGroup;

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

    this.locationProvider.initLocation().then(() => {
      this.currentLocation = this.locationProvider.getLocation();
    });

    this.initPickupNotesForm();
    this.initStartingMileagePickupForm();
    this.initEndingMileagePickupForm();

    this.initStartingMileageDropOffForm();
    this.initEndingMileageDropOffForm();

    if(!this.routesProvider.startingMileagePickupFormHasBeenSubmitted) {
      this.routesProvider.setState('startingMileagePickUpAccessible', true);
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

  onStartRoute(reOpen:boolean) {
    // if(this.routesProvider.canStartRoute()) {
    //   let options: LaunchNavigatorOptions = {
    //     start: this.currentLocation.latitude + ', ' + this.currentLocation.longitude,
    //     app: this.launchNavigator.APP.GOOGLE_MAPS,
    //     transportMode: this.launchNavigator.TRANSPORT_MODE.DRIVING,
    //   };
    //
    //   // get first param from Drively API
    //   this.launchNavigator.navigate(this.currentRoute.destinationAddr, options)
    //     .then(
    //       success => console.log('Launched navigator'),
    //       error => console.log('Error launching navigator', error)
    //     );
    // }


    this.routesProvider.startRoute(reOpen);

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

  onPickupComplete() {
    this.confirmPickupComplete().present();
  }

  onDropOffComplete() {
    this.confirmDropOffComplete().present();
  }

  onOpenRouteNotes() {
    this.navCtrl.push(RouteNotesComponent);
  }

  onUnFold() {
    if(this.folded) {
      this.isActive = true;
    } else {
      this.isActive = false;
    }
    this.folded = !this.folded;
  }

  private confirmPickupComplete() {
    const pickupCompleteAlert = this.alertCtrl.create({
      title: 'Is your pickup really complete?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: () => {
            this.routesProvider.setState('endingMileagePickUpFormReady', true);
            this.routesProvider.setState('pickupCanStart', false);
            this.routesProvider.setState('pickupCanEnd', false);
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
            this.routesProvider.setState('dropOffCanStart', false);
            this.routesProvider.setState('dropOffDidStart', false);
            this.routesProvider.setState('dropOffCanEnd', false);
            this.routesProvider.setState('dropOffDidEnd', true);
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

  initStartingMileagePickupForm() {
    let startingMileage: string = null;

    this.startingMileagePickupForm = new FormGroup({
      'startingMileage': new FormControl(startingMileage, Validators.required),
    });
  }

  initEndingMileagePickupForm() {
    let endingMileage: string = null;

    this.endingMileagePickupForm = new FormGroup({
      'endingMileage': new FormControl(endingMileage, Validators.required),
    });
  }

  initStartingMileageDropOffForm() {
    let startingMileage: string = null;

    this.startingMileageDropOffForm = new FormGroup({
      'startingMileage': new FormControl(startingMileage, Validators.required),
    });
  }

  initEndingMileageDropOffForm() {
    let endingMileage: string = null;

    this.endingMileageDropOffForm = new FormGroup({
      'endingMileage': new FormControl(endingMileage, Validators.required),
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
            this.imageUrl = data.nativeURL;
          })
          .catch((error: FileError) => {
            this.imageUrl = '';
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
        this.imageUrl = imageData;
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

  onSubmitStartingMileagePickupForm() {
    this.currentRoute.startingMileage = this.startingMileagePickupForm.value['startingMileage'];
    this.startingMileagePickupForm.reset();

    this.routesProvider.setState('startingMileagePickUpAccessible', false);
    this.routesProvider.setState('pickupCanStart', true);
  }

  onSubmitEndingMileagePickupForm() {
    this.currentRoute.endingMileage = this.endingMileagePickupForm.value['endingMileage'];
    this.endingMileagePickupForm.reset();

    this.routesProvider.setState('endingMileagePickUpFormReady', false);
    this.routesProvider.setState('pickupDidStart', false);
    this.routesProvider.setState('pickupCanCompleteForm', true);
    this.routesProvider.setState('pickupCanStart', false);
  }

  onSubmitPickupNotes() {
    this.currentRoute.additionalPassengers = this.pickupNotesForm.value['additionalPassengers'];
    this.currentRoute.noShow = this.pickupNotesForm.value['noShow'];
    this.currentRoute.cancellation = this.pickupNotesForm.value['cancellation'];
    this.pickupNotesForm.reset();

    this.routesProvider.setState('pickupCanCompleteForm', false);
    this.routesProvider.setState('pickupCanEnd', true);

    this.routesProvider.removeRoute();
    setTimeout(() => {
      this.routesProvider.setState('pickupDidEnd', true);
    }, 1000);
  }

  onSubmitStartMileageDropOffForm() {
    this.currentRoute.startingMileage = this.startingMileageDropOffForm.value['startingMileage'];
    this.startingMileageDropOffForm.reset();

    // this.routesProvider.setCurrentRoute(this.currentRoute);
    this.routesProvider.setState('pickupStartMileageFormDidComplete', true);
    this.routesProvider.setState('pickupDidEnd', false);
    this.routesProvider.setState('dropOffCanStart', true);
  }

  onSubmitEndingMileageDropOffForm() {
    this.currentRoute.endingMileage = this.endingMileageDropOffForm.value['startingMileage'];
    this.endingMileageDropOffForm.reset();

    this.routesProvider.removeRoute();
  }

}
