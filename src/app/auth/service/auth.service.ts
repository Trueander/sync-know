import { Injectable } from '@angular/core';
import {environment} from "../../../environment/environment";
import {LoginRequest} from "../models/login-request";
import {Observable} from "rxjs";
import {LoginResponse} from "../models/login-response";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl: string = `${environment.apiUrl}/v1/auth`;
  constructor(private http: HttpClient) { }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, request);
  }
}
