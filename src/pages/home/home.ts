import { Component } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { state, trigger, transition, style, animate, keyframes } from '@angular/animations';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  // animations: [
  //   trigger('routeAnimation', [
  //     transition(':enter', [
  //       style({'opacity': '0'}),
  //       animate(3000)
  //     ]),
  //   ])
  // ]

})
export class HomePage {

  constructor(private nativePageTransitions: NativePageTransitions, public navCtrl: NavController) {  }

  ionViewDidEnter() {
    this.nativePageTransitions.fade(null);
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


}
