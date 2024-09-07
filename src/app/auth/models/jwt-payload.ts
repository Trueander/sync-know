import {JwtPayload} from "jwt-decode";

export interface JwtPayloadLocal extends JwtPayload{
  roles: string[];
  firstname: string;
  lastname: string;
}
