export class AuthenticationState {
  constructor(
    public company: string,
    public code: string,
    public isAuthenticated: boolean,
  )
}
