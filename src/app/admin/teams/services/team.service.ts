import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../../environment/environment";
import {Team} from "../models/team.model";
import {PageReponse} from "../../../shared/models/page-reponse";

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  baseUrl: string = `${environment.apiUrl}/teams`;
  constructor(private http: HttpClient) { }

  getTeamsPagination(page: number, size: number, search: string): Observable<PageReponse<Team>> {
    return this.http.get<PageReponse<Team>>(`${this.baseUrl}/pagination?page=${page}&size=${size}&search=${search}`)
      .pipe(map((response: any) => new PageReponse<Team>(response.content, response.totalElements)));
  }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.baseUrl}`);
  }

  getTeamById(teamId: number): Observable<Team> {
    return this.http.get<Team>(`${this.baseUrl}/${teamId}`);
  }

  createTeam(Team: Team): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}`, Team);
  }

  updateTeam(teamId:number, Team: Team): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${teamId}`, Team);
  }

  deleteTeamById(teamId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${teamId}`);
  }
}
