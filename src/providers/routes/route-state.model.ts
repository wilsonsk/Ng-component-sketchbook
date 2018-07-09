export class RouteState {
  constructor(
    public numRoutes: number,
    public routeType: string,

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
    public showAllRoutes: boolean,
  ) {}
}
