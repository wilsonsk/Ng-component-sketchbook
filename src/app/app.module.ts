import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Drively } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
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

// Common components
import { HeaderComponent } from '../components/common/header/header';
import { DrivelyLogoComponent } from '../components/common/drively-logo/drively-logo';

import { DriverLoginComponent } from '../components/driver-login/driver-login';
import { CompanyAuthComponent } from '../components/company-auth/company-auth';
import { InspectionFormComponent } from '../components/inspection-form/inspection-form';
import { RoutesListComponent } from '../components/routes-list/routes-list';
import { RouteNotesComponent } from '../components/route-notes/route-notes';
import { PendingRouteListComponent } from '../components/pending-route-list/pending-route-list';

import { LocationProvider } from '../providers/location/location.provider';
import { RoutesProvider } from '../providers/routes/routes.provider';

import { DottedBorderDirective } from '../directives/dotted-border/dotted-border';
import { AuthenticationProvider } from '../providers/authentication/authentication.provider';

@NgModule({
  declarations: [
    Drively,
    HomePage,
    TabsPage,
    DrivelyLogoComponent,
    CompanyAuthComponent,
    DriverLoginComponent,
    HeaderComponent,
    InspectionFormComponent,
    RoutesListComponent,
    DottedBorderDirective,
    RouteNotesComponent,
    PendingRouteListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(Drively)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Drively,
    HomePage,
    TabsPage,
    CompanyAuthComponent,
    DriverLoginComponent,
    HeaderComponent,
    InspectionFormComponent,
    RoutesListComponent,
    RouteNotesComponent,
    PendingRouteListComponent,
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
    NativeGeocoder,
    LocationProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RoutesProvider,
    AuthenticationProvider,
  ]
})
export class AppModule {}
