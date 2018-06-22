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
import { RoutesProvider } from '../../providers/routes/routes';

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
        animate('.3s')
      ]),
      transition('* => void', [
        animate('.3s', style({
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
        animate('0.5s 0.8s')
      ]),
      transition('* => void', [
        animate('0.5s', style({
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

  // Component States
  isActive:boolean;
  routeTypeState: string = '';
  pickupCanStart: boolean = true;
  pickupCanCompleteForm: boolean = false;
  pickupCanEnd: boolean = false;
  pickupComplete: boolean = false;
  dropOffCanStart: boolean = false;
  dropOffCanEnd: boolean = false;
  dropOffComplete: boolean = false;

  // Route vars
  currentRoute: RouteModel;
  currentLocation: LocationModel;
  routes: RouteModel[] = [];
  numRoutes: number;
  imageUrl = '';

  // Animation only States
  folded: boolean = true;

  // Reactive form vars
  pickupNotesForm: FormGroup;
  mileageForm: FormGroup;

  constructor(public navCtrl: NavController, private launchNavigator: LaunchNavigator, private nativePageTransitions: NativePageTransitions,
              private locationProvider:LocationProvider, private routesProvider: RoutesProvider, private alertCtrl: AlertController,
              private camera: Camera, private toastCtrl: ToastController, private file: File) {
                this.updateRoutes();
              }

  ionViewWillEnter() {
    this.routesChangedSubscription = this.routesProvider.routesChanged.subscribe((routes: RouteModel[]) => {
      this.updateRoutes();
    });

    // locationChangedSubscription needs to be tested
    this.locationChangedSubscription = this.locationProvider.locationChanged.subscribe((loc) => {
      this.currentLocation = this.locationProvider.getLocation();
    });

    this.locationProvider.initLocation().then(() => {
      this.currentLocation = this.locationProvider.getLocation();
    });

    this.initPickupNotesForm();
    this.initMileageForm();
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
  }

  // onGetRoute(route: RouteModel) {
  //   this.currentRouteProvider.setCurrentRoute(route);
  //   this.navCtrl.setRoot(RouteNavigationComponent);
  // }

  private updateRoutes() {
    this.routes = this.routesProvider.getRoutes();
    this.currentRoute = this.routes[0];
    this.routesProvider.setCurrentRoute(this.currentRoute);
    this.numRoutes = this.routes.length;
    if(this.currentRoute.type === 'p') {
      this.routeTypeState = 'pickup';
      this.pickupCanStart = true;
    } else if(this.currentRoute.type === 'd') {
      this.routeTypeState = 'dropOff';
      setTimeout(() => {
        this.pickupComplete = true;
      }, 1000);
    }
  }

  onStartRoute() {
    if(this.routeTypeState==='pickup') {
      this.pickupCanEnd = true;
    } else {
      this.dropOffCanEnd = true;
    }

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
            this.pickupCanCompleteForm = true;
            this.pickupCanStart = false;
            this.pickupCanEnd = false;
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
            this.dropOffComplete = true;
            this.dropOffCanStart = false;
            this.dropOffCanEnd = false;
            this.routesProvider.removeRoute();
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

  initMileageForm() {
    let startingMileage: string = null;
    // let endingMileage: string = null;

    this.mileageForm = new FormGroup({
      'startingMileage': new FormControl(startingMileage, Validators.required),
      // 'endingMileage': new FormControl(endingMileage),
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

  onSubmitPickupNotes() {
    this.currentRoute.additionalPassengers = this.pickupNotesForm.value['additionalPassengers'];
    this.currentRoute.noShow = this.pickupNotesForm.value['noShow'];
    this.currentRoute.cancellation = this.pickupNotesForm.value['cancellation'];

    this.pickupCanCompleteForm = false;

    alert(JSON.stringify(this.currentRoute));
    this.routesProvider.removeRoute();
  }

  onSubmitMileageForm() {
    this.currentRoute.startingMileage = this.mileageForm.value['startingMileage'];

    this.routesProvider.setCurrentRoute(this.currentRoute);
    
    alert(JSON.stringify(this.currentRoute));
    this.pickupComplete = false;
    this.dropOffCanStart = true;
  }

}
