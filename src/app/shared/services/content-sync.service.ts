import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContentSyncService {
  syncListContent$ = new Subject<boolean>();

  constructor() { }

  sync(): void {
    this.syncListContent$.next(true);
  }
}
