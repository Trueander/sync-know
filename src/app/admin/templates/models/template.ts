import {Team} from "../../teams/models/team.model";
import {User} from "../../users/models/user.model";

export class Template {
  constructor(public id: number,
              public title: string,
              public htmlContent: string,
              public teams: Team[],
              public createdAt: Date,
              public updatedAt: Date,
              public user: User) {
  }
}
