import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CompanyAuthComponent } from '../../components/company-auth/company-auth';
import { InspectionFormComponent } from '../../components/inspection-form/inspection-form';
import { RouteNavigationComponent } from '../../components/route-navigation/route-navigation';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InspectionFormComponent;
  tab3Root = RouteNavigationComponent;
  tab4Root = CompanyAuthComponent;

  constructor() {

  }
}
