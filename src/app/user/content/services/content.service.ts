import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {ContentTree} from "../models/content-tree";
import {ContentRequest} from "../models/content-request";
import {environment} from "../../../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class ContentService {
  baseUrl: string = `${environment.apiUrl}/content`;
  constructor(private http: HttpClient) { }

  saveContent(contenido: ContentRequest): Observable<number> {
    return this.http.post(this.baseUrl, contenido,{ observe: 'response' })
      .pipe(map((response: any) => this.getIdFromLocation(response)));
  }

  updateContent(id: number, content: ContentRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, content);
  }

  get(id: number) {
    return this.http.get(this.baseUrl+'/'+id);
  }

  getContenidosTree(): Observable<ContentTree[]> {
    return this.http.get<ContentTree[]>(`${this.baseUrl}/tree`);
  }

  private getIdFromLocation(response: any): number {
    const location = response.headers.get('Location');
    if (location) {
      const id = location.split('/').pop();
      return Number(id);
    }
    throw new Error('Location header not found');
  }
}
