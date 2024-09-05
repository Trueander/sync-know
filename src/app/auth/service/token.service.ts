import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {JwtPayloadLocal} from "../models/jwt-payload";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'sessionToken';
  private authenticated = false;

  constructor(private router: Router) {
    this.authenticated = !!this.getToken();
  }

  setToken(token: string): void {
    this.authenticated = true;
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | undefined {
    let token = this.getToken();
    if(!token) {
      return undefined;
    }
    const decodedToken: JwtPayload = jwtDecode(token);
    return decodedToken && decodedToken.sub;
  }

  getRoles(): string[] {
    let token = this.getToken();
    if(!token) {
      return [];
    }
    const decodedToken: JwtPayloadLocal = jwtDecode(token);
    return decodedToken.roles.map(role => role.split("_")[1]);
  }

  clearOnLogout(): void {
    this.authenticated = false;
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(["/login"]);
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }
}
