import {Injectable} from '@angular/core';
import {Content} from "../models/content";

@Injectable({
  providedIn: 'root'
})
export class RecentSearchService {
  private recentSearchesKey = 'recentSearches';
  private maxSearches = 5;

  constructor() {}

  getRecentSearches(): Content[] {
    let items = localStorage.getItem(this.recentSearchesKey);
    return items ? JSON.parse(items) : [];
  }

  addRecentSearch(content: Content): void {
    let recentSearches = this.getRecentSearches();
    let searches = recentSearches.filter(item => item.id !== content.id);
    searches.unshift(content);

    if(searches.length > this.maxSearches) {
      searches.pop();
    }

    localStorage.setItem(this.recentSearchesKey, JSON.stringify(searches));
  }

  removerSearch(contentId: number): void {
    let searches = this.getRecentSearches().filter(item => item.id !== contentId);
    localStorage.setItem(this.recentSearchesKey, JSON.stringify(searches));
  }
}
