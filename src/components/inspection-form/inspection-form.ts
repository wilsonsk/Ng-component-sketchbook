import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import { VehicleInspectionFormModel } from '../../models/vehicle-inspection-form.model';


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
  inspectionForm: FormGroup;
  formToSubmit: VehicleInspectionFormModel;
  oilChangeDueFlag: boolean = false;
  firstAidKitFlag: boolean = false;
  imageUrl = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private camera: Camera, private toastCtrl: ToastController, private file: File,
              private nativePageTransitions: NativePageTransitions) {

    this.initForm();
  }

  initForm() {
    let driverName:string = '';
    let date:string = '';
    let cabNumber:number;
    let idBadge:boolean = false;
    let paperWork:boolean = false;
    let cleanCar:boolean = false;
    let phoneAndCharger:boolean = false;
    let gasCard:boolean = false;
    let oilChangeDue:boolean = false;
    let oilChangeDate:string = null;
    let oilChangeMileage:string = null;
    let currentMileage:string = null;
    let breakLights:boolean = false;
    let headLights:boolean = false;
    let tires:boolean = false;
    let accidentReports:boolean = false;
    let firstAidKit:boolean = false;
    let firstAidKitItemsToReplace = new FormArray([]);

    this.inspectionForm = new FormGroup({
      'driverName': new FormControl(driverName, Validators.required),
      'date': new FormControl(date, Validators.required),
      'cabNumber': new FormControl(cabNumber, [Validators.required, Validators.pattern(/^[1-9]+[0-9]*$/)]),
      'idBadge': new FormControl(idBadge),
      'paperWork': new FormControl(paperWork),
      'cleanCar': new FormControl(cleanCar),
      'phoneAndCharger': new FormControl(phoneAndCharger),
      'gasCard': new FormControl(gasCard),
      'oilChangeDue': new FormControl(oilChangeDue),
      'oilChangeDate': new FormControl(oilChangeDate),
      'oilChangeMileage': new FormControl(oilChangeMileage, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'currentMileage': new FormControl(currentMileage, Validators.pattern(/^[1-9]+[0-9]*$/)),
      'breakLights': new FormControl(breakLights),
      'headLights': new FormControl(headLights),
      'tires': new FormControl(tires),
      'accidentReports': new FormControl(accidentReports),
      'firstAidKit': new FormControl(firstAidKit),
      'firstAidKitItemsToReplace': firstAidKitItemsToReplace,
    })
  }

  onSubmit() {
    // const loading = this.loadingCtrl.create({
    //   content: 'Submitting your vehicle inspection...'
    // });
    // loading.present();

      this.formToSubmit = new VehicleInspectionFormModel(
        this.inspectionForm.value['driverName'],
        this.inspectionForm.value['date'],
        this.inspectionForm.value['cabNumber'],
        this.inspectionForm.value['idBadge'],
        this.inspectionForm.value['paperWork'],
        this.inspectionForm.value['cleanCar'],
        this.inspectionForm.value['phoneAndCharger'],
        this.inspectionForm.value['gasCard'],
        this.inspectionForm.value['oilChangeDue'],
        this.inspectionForm.value['oilChangeDate'],
        this.inspectionForm.value['oilChangeMileage'],
        this.inspectionForm.value['currentMileage'],
        this.inspectionForm.value['breakLights'],
        this.inspectionForm.value['headLights'],
        this.inspectionForm.value['tires'],
        this.inspectionForm.value['accidentReports'],
        this.inspectionForm.value['firstAidKit'],
        this.inspectionForm.value['firstAidKitItemsToReplace'],
      );
      alert(JSON.stringify(this.formToSubmit))
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

    onOilChangeDue() {
      // If these form values are NULL then oil change is NOT due
      if(this.oilChangeDueFlag) {
        this.inspectionForm.value['oilChangeDate'] = null;
        this.inspectionForm.value['oilChangeMileage'] = null;
        this.inspectionForm.value['currentMileage'] = null;
      }
      this.oilChangeDueFlag = !this.oilChangeDueFlag;
    }

    onFirstAidKit() {
      // If these form values are NULL then oil change is NOT due
      if(this.firstAidKitFlag) {
        // this.inspectionForm.value['firstAidKitItemsToReplace'] = null;
        // this.inspectionForm.value['oilChangeMileage'] = null;
        // this.inspectionForm.value['currentMileage'] = null;
      }
      this.firstAidKitFlag = !this.firstAidKitFlag;
    }

    onAddFirstAidKitItem() {
      (<FormArray>this.inspectionForm.get('firstAidKitItemsToReplace')).push(new FormGroup({
        'itemName': new FormControl(null, Validators.required),
        'itemQuanity': new FormControl(null, [Validators.required])
      }));
    }

    onDeleteFirstAidKitItem(index:number) {
      (<FormArray>this.inspectionForm.get('firstAidKitItemsToReplace')).removeAt(index);
    }

}
