import {Component, OnInit} from '@angular/core';
import {RecentSearchService} from "../content/services/recent-search.service";
import {Content} from "../content/models/content";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {DividerModule} from "primeng/divider";
import {ContentService} from "../content/services/content.service";
import {Observable} from "rxjs";
import {AvatarModule} from "primeng/avatar";
import {BadgeModule} from "primeng/badge";
import {TooltipModule} from "primeng/tooltip";
import {UserService} from "../../admin/users/services/user.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    NgIf,
    RouterLink,
    DividerModule,
    AsyncPipe,
    AvatarModule,
    BadgeModule,
    TooltipModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{
  mostRecentContent$!: Observable<Content[]>;
  importantContent$!: Observable<Content[]>;
  favoriteByUser$!: Observable<Content[]>;
  constructor(private service: RecentSearchService,
              private contentService: ContentService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadImportantContent();
    this.loadMostRecentContent();
    this.loadFavoritesByUser();
  }

  private loadImportantContent(): void {
    this.importantContent$ = this.contentService.getImportantContent();
  }

  private loadMostRecentContent(): void {
    this.mostRecentContent$ = this.contentService.getMostRecentContent();
  }

  private loadFavoritesByUser(): void {
    this.favoriteByUser$ = this.userService.getFavoriteContentByUser();
  }

  updateImportantContent(): void {
    this.loadImportantContent();
  }

  updateMostRecentContent(): void {
    this.loadMostRecentContent();
  }

  updateFavoritesByUser(): void {
    this.loadFavoritesByUser();
  }
}
