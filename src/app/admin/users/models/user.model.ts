import {Team} from "../../teams/models/team.model";
import {Role} from "../../../shared/models/role";

export class User {
  constructor(public id: number,
              public firstname: string,
              public lastname: string,
              public email: string,
              public team: Team,
              public roles: Role[],
              public createdAt: Date) {
  }
}
