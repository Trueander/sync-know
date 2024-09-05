export class UserRequest {
  constructor(public firstname: string,
              public lastname: string,
              public email: string,
              public password: string,
              public rolIds: number[],
              public teamId?: number) {
  }
}
