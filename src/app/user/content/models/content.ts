import {User} from "../../../admin/users/models/user.model";

export class Content {
  constructor(public id: number,
              public title: string,
              public htmlContent: string,
              public createdAt: Date,
              public user: User) { }
}
