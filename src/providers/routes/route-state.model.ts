export class RouteState {
  constructor(
    public numRoutes: number,
    public routeType: string,

    // public startingMileagePickUpAccessible: boolean,
    // public endingMileagePickUpFormReady: boolean,
    //
    // public pickupCanStart: boolean,
    // public pickupDidStart: boolean,
    // public pickupStartMileageFormDidComplete: boolean,
    // public pickupCanCompleteForm: boolean,
    // public pickupCanEnd: boolean,
    // public pickupDidEnd: boolean,
    //
    // public dropOffCanStart: boolean,
    // public dropOffDidStart: boolean,
    // public dropOffCanEnd: boolean,
    // public dropOffDidEnd: boolean,
    public startingMileageFormAccessible: boolean,
    public endingMileageFormAccessible: boolean,
    public startingMileageFormHasBeenSubmitted: boolean,
    public endingMileageFormHasBeenSubmitted: boolean,

    public pickNotesFormAccessible: boolean,

    public tripCanStart: boolean,
    public tripDidStart: boolean,
    public tripInProgress: boolean,
    public tripCanEnd: boolean,
    public tripDidEnd: boolean,
  ) {}
}
