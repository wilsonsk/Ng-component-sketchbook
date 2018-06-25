export class RouteState {
  constructor(
    public numRoutes: number,
    public routeTypeState: string,

    public startingMileagePickUpAccessible: boolean,
    public endingMileagePickUpFormReady: boolean,

    public pickupCanStart: boolean,
    public pickupDidStart: boolean,
    public pickupStartMileageFormDidComplete: boolean,
    public pickupCanCompleteForm: boolean,
    public pickupCanEnd: boolean,
    public pickupDidEnd: boolean,

    public dropOffCanStart: boolean,
    public dropOffDidStart: boolean,
    public dropOffCanEnd: boolean,
    public dropOffDidEnd: boolean,
  ) {}
}
