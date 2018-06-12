import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { InspectionFormComponent } from '../../components/inspection-form/inspection-form';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = InspectionFormComponent;

  constructor() {

  }
}
