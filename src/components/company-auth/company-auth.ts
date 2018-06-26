import { Component } from '@angular/core';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { AuthenticationProvider } from '../../providers/authentication/authentication.provider';

@Component({
  selector: 'company-auth',
  templateUrl: 'company-auth.html',
})
export class CompanyAuthComponent {
  token: string;

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController,
              private alertCtrl: AlertController, private nativePageTransitions: NativePageTransitions,
              private authenticationProvider: AuthenticationProvider) {}

  ionViewWillEnter() {
    this.onLoadToken();
  }

  ionViewWillLeave() {
    // Animations
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

  private onLoadToken() {
    this.authenticationProvider.fetchTokenFromDeviceStorage()
      .then((token) => {
        if(token) {
          this.authenticationProvider.isTokenExpired(token)
            .subscribe((expired) => {
              if(expired) {
                const a = this.alertCtrl.create({
                  title: 'Company Authentication Token is Expired',
                  buttons: ['OK']
                });
                a.present();
              } else {
                this.token = token;
                this.getCompanyFromToken();
              }
            });
          }
      })
      .catch((error) => {
        alert(error)
      });
  }

  private getCompanyFromToken() {
    this.authenticationProvider.fetchCompanyFromToken(this.token)
      .subscribe((company: any ={}) => {
        if(company) {
          this.authenticationProvider.setAuth(company.name, company.code);
          // this.navCtrl.setRoot(DriverLoginPage);
        } else {
          console.log('failed to fetch company data from token');
        }
      });
  }

  onSubmit(form: NgForm) {
    const loading = this.loadingCtrl.create({
      content: 'Checking your company code...'
    });
    loading.present();

    this.authenticationProvider.checkCompanyCode(form.value.company, form.value.companyCode)
      .subscribe((data) => {
        console.log('checkCompanyCode: ' + data);
        if(data) {
          loading.dismiss();
          this.authenticationProvider.setAuth(form.value.company, form.value.companyCode);
          this.authenticationProvider.saveTokenToDeviceStorage(data);
          const a = this.alertCtrl.create({
            title: 'Company Authentication was Successful',
            buttons: ['OK']
          });
          a.present();
          // this.navCtrl.setRoot(DriverLoginPage);
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
