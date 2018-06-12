import { Component } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';
/**
 * Generated class for the CompanyAuthComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'company-auth',
  templateUrl: 'company-auth.html',
})
export class CompanyAuthComponent {
  token: string;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private nativePageTransitions: NativePageTransitions) {
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

  onSubmit(form: NgForm) {

  }
}
