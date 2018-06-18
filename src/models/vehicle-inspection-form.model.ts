import { FirstAidKitItemModel } from './first-aid-kit-item.model';
import { BioHazardKitItemModel } from './bio-hazard-kit-item.model';

export class VehicleInspectionFormModel {
    constructor(
      public driverName: string,
      public date: string,
      public cabNumber: number,
      public idBadge: boolean,
      public paperWork: boolean,
      public cleanCar: boolean,
      public phoneAndCharger: boolean,
      public gasCard: boolean,
      public oilChangeDue: boolean,
      public oilChangeDate: string,
      public oilChangeMileage: number,
      public currentMileage: number,
      public breakLights: boolean,
      public headLights: boolean,
      public tires: boolean,
      public accidentReports: boolean,
      public firstAidKit: boolean,
      public firstAidKitItemsToReplace: FirstAidKitItemModel[],
      public bioHazardKit: boolean,
      public bioHazardKitItemsToReplace: BioHazardKitItemModel[],
    ) {}
}
