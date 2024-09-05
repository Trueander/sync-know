import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {TokenService} from "../service/token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {
      return !this.tokenService.isAuthenticated() ? true : this.router.createUrlTree(['/dashboard']);
  }
}
