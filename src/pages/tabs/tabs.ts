import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CompanyAuthComponent } from '../../components/company-auth/company-auth';
import { DriverLoginComponent } from '../../components/driver-login/driver-login';
import { InspectionFormComponent } from '../../components/inspection-form/inspection-form';
import { RouteNavigationComponent } from '../../components/route-navigation/route-navigation';
import { RoutesListComponent } from '../../components/routes-list/routes-list';
import { PendingRouteListComponent } from '../../components/pending-route-list/pending-route-list';

import { RoutesProvider } from '../../providers/routes/routes.provider';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  havePendingRoutes: boolean = false;

  tab1Root = HomePage;
  tab2Root = InspectionFormComponent;
  tab4Root = CompanyAuthComponent;
  tab5Root = DriverLoginComponent;
  tab6Root = RoutesListComponent;
  tab7Root = PendingRouteListComponent;

  constructor(private routesProvider: RoutesProvider) {
    this.havePendingRoutes = this.routesProvider.checkPendingRoutes();
  }
}
