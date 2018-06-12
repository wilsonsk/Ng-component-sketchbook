import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { NgForm } from '@angular/forms';

import { Camera } from '@ionic-native/camera';
import { File, Entry, FileError } from '@ionic-native/file';

// import { AuthService } from'../../services/auth.service';
// import { DriverService } from '../../services/driver.service';
// import { InspectionService } from '../../services/inspection.service';
//
// import { TripsPage } from '../schedule/trips/trips';

declare var cordova: any;

@Component({
  selector: 'inspection-form',
  templateUrl: 'inspection-form.html',
})
export class InspectionFormComponent {
  imageUrl = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private camera: Camera, private toastCtrl: ToastController, private file: File) {
  }

  ionViewWillLeave() {
   let options: NativeTransitionOptions = {
      direction: 'up',
      duration: 500,
     };

   this.nativePageTransitions.curl(options);
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

    onSubmit(form: NgForm) {
      const loading = this.loadingCtrl.create({
        content: 'Submitting your vehicle inspection...'
      });
      loading.present();

    }

}
