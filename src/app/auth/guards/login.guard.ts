import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import {TokenService} from "../service/token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(): boolean | UrlTree {

    if(!this.tokenService.isAuthenticated()) {
      return true;
    }

    const roles = this.tokenService.getRoles();
    let route = roles.includes('ADMIN') ? '/admin' : '/';
    return this.router.createUrlTree([route])
  }
}
