import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environment/environment";
import {map, Observable} from "rxjs";
import {PageReponse} from "../../../shared/models/page-reponse";
import {Template} from "../models/template";
import {TemplateRequest} from "../models/template-request";

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private BASE_URL: string = `${environment.apiUrl}/templates`;
  constructor(private http: HttpClient) { }

  getTemplatesPagination(page: number, size: number, search: string): Observable<PageReponse<Template>> {
    return this.http.get<PageReponse<Template>>(`${this.BASE_URL}/pagination?page=${page}&size=${size}&search=${search}`)
      .pipe(map((response: any) => new PageReponse<Template>(response.content, response.totalElements)));
  }

  getTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>(`${this.BASE_URL}`);
  }

  getTemplateById(templateId: number): Observable<Template> {
    return this.http.get<Template>(`${this.BASE_URL}/${templateId}`);
  }

  deleteTemplateById(templateId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.BASE_URL}/${templateId}`);
  }

  createTemplate(request: TemplateRequest): Observable<void> {
    return this.http.post<void>(this.BASE_URL, request);
  }

  updateTemplate(templateId: number, request: TemplateRequest): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/${templateId}`, request);
  }
}
