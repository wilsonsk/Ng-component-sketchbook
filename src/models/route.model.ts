export class RouteModel {
    constructor(
      public pickUpTime: string,
      public tripCount: number,
      public destinationAddr: string,
      // public sourceLatitude: string,
      // public sourceLongitude: string,
      // public destinationLatitude: string,
      // public destinationLongitude: string,
      public appointmentTime: string,
      public ambulatory: boolean,
      public shared: boolean,
      public tripNotes: string,
      public routeType: string,
      public additionalPassengers: boolean,
      public noShow: boolean,
      public cancellation: boolean,
      public startingMileage: string,
      public endingMileage: string,
      // public facesheet: string,
      // public signature: string,
    ) {}
}
