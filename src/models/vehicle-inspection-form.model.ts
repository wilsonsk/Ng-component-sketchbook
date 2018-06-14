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
    ) {}
}
