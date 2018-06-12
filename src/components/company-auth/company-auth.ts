import { Component } from '@angular/core';
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
                private alertCtrl: AlertController) {
    }


    onSubmit(form: NgForm) {

    }



}
