import { Injectable } from '@angular/core';
import {CanMatch, UrlTree} from '@angular/router';
import {TokenService} from "../service/token.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  constructor(private tokenService: TokenService) {}

  canMatch(): boolean | UrlTree {
    return this.tokenService.isAuthenticated();
  }
}
