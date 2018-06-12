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
  styleUrl: 'company-auth.scss'
})
export class CompanyAuthComponent {
    token: string;

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
                private alertCtrl: AlertController) {
    }


    onSubmit(form: NgForm) {
      const loading = this.loadingCtrl.create({
        content: 'Checking your company code...'
      });
      loading.present();

      this.authService.checkCompanyCode(form.value.company, form.value.companyCode)
        .subscribe((data) => {
          console.log('checkCompanyCode: ' + data);
          if(data) {
            loading.dismiss();
            this.navCtrl.setRoot(DriverLoginPage);
          } else {
            loading.dismiss();
            const a = this.alertCtrl.create({
              title: 'Company Code failed or is expired',
              buttons: ['OK']
            });
            a.present();
          }
        });
    }



}
