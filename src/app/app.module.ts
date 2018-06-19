import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { File } from '@ionic-native/file';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { DrivelyLogoComponent } from '../components/common/drively-logo/drively-logo';
import { CompanyAuthComponent } from '../components/company-auth/company-auth';
import { DriverLoginComponent } from '../components/driver-login/driver-login';
import { InspectionFormComponent } from '../components/inspection-form/inspection-form';
import { RoutesListComponent } from '../components/routes-list/routes-list';

import { LocationProvider } from '../providers/location/location.provider';
import { RoutesProvider } from '../providers/routes/routes';

import { DottedBorderDirective } from '../directives/dotted-border/dotted-border';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    DrivelyLogoComponent,
    CompanyAuthComponent,
    DriverLoginComponent,
    InspectionFormComponent,
    RoutesListComponent,
    DottedBorderDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    CompanyAuthComponent,
    DriverLoginComponent,
    InspectionFormComponent,
    RoutesListComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Camera,
    FileTransfer,
    NativePageTransitions,
    LaunchNavigator,
    Geolocation,
    LocationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RoutesProvider,
  ]
})
export class AppModule {}
