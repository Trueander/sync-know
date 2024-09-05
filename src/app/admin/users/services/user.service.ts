import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../../environment/environment";
import {User} from "../models/user.model";
import {LoginDTO} from "../models/login";
import {PageReponse} from "../../../shared/models/page-reponse";
import {Team} from "../../teams/models/team.model";
import {UserRequest} from "../models/user-request.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: string = `${environment.apiUrl}/users`;
  baseUrlCreate: string = `${environment.apiUrl}/v1/auth/register`;
  constructor(private http: HttpClient) { }

  getUsersPagination(page: number, size: number, search: string): Observable<PageReponse<User>> {
    return this.http.get<PageReponse<User>>(`${this.baseUrl}?page=${page}&size=${size}&search=${search}`)
      .pipe(map((response: any) => new PageReponse<User>(response.content, response.totalElements)));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  createUser(user: UserRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrlCreate}`, user);
  }

  login(login: LoginDTO): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, login);
  }

  updateUser(userId:number, User: UserRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${userId}`, User);
  }

  deleteUserById(userId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/${userId}`);
  }
}
