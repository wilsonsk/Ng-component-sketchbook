import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CompanyAuthComponent } from '../../components/company-auth/company-auth';
import { DriverLoginComponent } from '../../components/driver-login/driver-login';
import { InspectionFormComponent } from '../../components/inspection-form/inspection-form';
import { RouteNavigationComponent } from '../../components/route-navigation/route-navigation';
import { RoutesListComponent } from '../../components/routes-list/routes-list';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InspectionFormComponent;
  tab3Root = RouteNavigationComponent;
  tab4Root = CompanyAuthComponent;
  tab5Root = DriverLoginComponent;
  tab6Root = RoutesListComponent;

  constructor() {

  }
}
