import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { LocationProvider } from '../../providers/location/location.provider';
import { RoutesProvider } from '../../providers/routes/routes';

import { RouteModel } from '../../models/route.model';
import { LocationModel } from '../../models/location.model';

@Component({
  selector: 'route-notes',
  templateUrl: 'route-notes.html'
})
export class RouteNotesComponent {
  routeNotesForm: FormGroup;

  constructor(private navCtrl: NavController, private nativePageTransitions: NativePageTransitions,
              private routesProvider: RoutesProvider) {
                this.initForm();
  }

  ionViewWillLeave() {
    this.routesProvider.currentRoute.notes = this.routeNotesForm.value['notes'];

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

  onPopView() {
    this.navCtrl.pop();
  }

  initForm() {
    let notes:string = '';

    if(this.routesProvider.currentRoute.notes) {
        notes = this.routesProvider.currentRoute.notes;
    }

    this.routeNotesForm = new FormGroup({
      'notes': new FormControl(notes),
    })
  }

}
