import { Injectable } from '@angular/core';
import {CanActivate, CanMatch, Router, UrlTree} from '@angular/router';
import {TokenService} from "../service/token.service";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private tokenService: TokenService,
              private router: Router) {}

  canActivate(): boolean | UrlTree {
    const roles = this.tokenService.getRoles();
    let route = roles.includes('ADMIN') ? '/admin' : '/';
    return this.router.createUrlTree([route]);
  }
}
