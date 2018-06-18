export class RouteModel {
    constructor(
      public pickUpTime: string,
      public tripCount: number,
      public source: string,
      public destination: string,
      public appointmentTime: string,
      public ambulatory: boolean,
      public shared: boolean,
    ) {}
}
