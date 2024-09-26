import {Component, OnInit} from '@angular/core';
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  Observable,
  of,
  Subject,
  switchMap, takeUntil,
  tap
} from "rxjs";
import {ContentService} from "../../services/content.service";
import {PageReponse} from "../../../../shared/models/page-reponse";
import {Content} from "../../models/content";
import {errorAlert} from "../../../../shared/utils/alert-messages.utils";
import {AsyncPipe, DatePipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {ContentSyncService} from "../../../../shared/services/content-sync.service";
import {DividerModule} from "primeng/divider";
import {CardModule} from "primeng/card";
import {PaginatorModule} from "primeng/paginator";
import {RecentSearchService} from "../../services/recent-search.service";

@Component({
  selector: 'app-search-content',
  standalone: true,
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    DividerModule,
    CardModule,
    DatePipe,
    PaginatorModule,
    RouterLink,
    NgTemplateOutlet,
    AsyncPipe
  ],
  providers: [ContentService],
  templateUrl: './search-content.component.html',
  styleUrl: './search-content.component.scss'
})
export class SearchContentComponent implements OnInit {
  searchFC: FormControl = new FormControl('');
  contentList!: Content[] | undefined;
  size: number = 6;
  page: number = 0;
  first: number = 0;
  totalElements: number = 0;
  recentSearches: Content[] = [];
  unsubscribe$: Subject<void> = new Subject<void>();
  loadingSearch$!: Observable<boolean>;

  constructor(private config: DynamicDialogConfig,
              public dialogRef: DynamicDialogRef,
              private contentService: ContentService,
              private router: Router,
              private contentSyncService: ContentSyncService,
              private recentSearchService: RecentSearchService) {
  }

  ngOnInit(): void {
    this.searchFC.valueChanges
      .pipe(
        takeUntil(this.unsubscribe$),
        debounceTime(300),
        distinctUntilChanged(),
        tap(this.setDefaultSearchIfEmpty),
        filter(text => text.length > 2),
        switchMap(() => this.searchContent$())
      )
      .subscribe();

    this.loadRecentSearches();
  }

  private setDefaultSearchIfEmpty = (text: string): void => {
    if(text.length === 0) {
      this.contentList = undefined;
    }
  }

  addRecentSearch(content: Content): void {
    this.recentSearchService.addRecentSearch(content);
    this.loadRecentSearches();
  }

  deleteRecentSearch(contentId: number): void {
    this.recentSearchService.removerSearch(contentId);
    this.loadRecentSearches();
  }

  private onSearchSuccess = (response: PageReponse<Content>): void => {
    this.contentList = response.items;
    this.totalElements = response.totalElements;
  }

  private onSearchError = () => {
    errorAlert('Ocurrió un error al realizar la búsqueda');
    return of([]);
  }

  private searchContent$(): Observable<PageReponse<Content> | never[]> {
    this.loadingSearch$ = of(true);
    return this.contentService
      .searchContent(this.searchFC.value, this.page, this.size)
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(this.onSearchSuccess),
        catchError(this.onSearchError),
        finalize(() => this.loadingSearch$ = of(false))
      );
  }

  goToContent(content: Content): void {
    this.router.navigate(['/contenido', content.id]);
    this.addRecentSearch(content);
    this.contentSyncService.sync();
    this.dialogRef.close();
  }

  onPageChange(event: any): void {
    this.page = event.page;
    this.first = event.first;
    this.size = event.rows;
    this.searchContent$().subscribe();
  }

  private loadRecentSearches(): void {
    this.recentSearches = this.recentSearchService.getRecentSearches();
  }
}
