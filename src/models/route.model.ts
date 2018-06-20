export class RouteModel {
    constructor(
      public pickUpTime: string,
      public tripCount: number,
      public sourceAddr: string,
      public destinationAddr: string,
      // public sourceLatitude: string,
      // public sourceLongitude: string,
      // public destinationLatitude: string,
      // public destinationLongitude: string,
      public appointmentTime: string,
      public ambulatory: boolean,
      public shared: boolean,
      public tripNotes: string,
      public type: string,

    ) {}
}
