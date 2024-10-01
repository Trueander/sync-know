import {Component, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {Content} from "../../user/content/models/content";
import {ContentService} from "../../user/content/services/content.service";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs";
import {PageReponse} from "../../shared/models/page-reponse";
import {DatePipe, NgIf} from "@angular/common";
import {successAlert} from "../../shared/utils/alert-messages.utils";
import {DialogModule} from "primeng/dialog";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    Button,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    DatePipe,
    DialogModule,
    NgIf,
    TooltipModule
  ],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent implements OnInit {
  contents: Content[] = [];
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  searchFormControl: FormControl = new FormControl('');
  contentToShow!: Content;
  toggleModal: boolean = false;

  constructor(private contentService: ContentService) {
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(text => text.length > 2 || text.length === 0),
        tap(() => this.searchContent())
      ).subscribe();
  }

  searchContent(event?: TableLazyLoadEvent): void {
    if(event) {
      this.page = event.first! / event.rows!;
      this.pageSize = event.rows!;
    } else {
      this.page = 0;
    }

    this.contentService.searchContent(this.searchFormControl.value, this.page, this.pageSize)
      .pipe(
        tap(this.loadPagination)
      )
      .subscribe();
  }

  private loadPagination = (response: PageReponse<Content>): void => {
    this.contents = response.items;
    this.totalRecords = response.totalElements;
  }

  updateImportantStatus(content: Content): void {
    this.contentService.updateImportantStatus(content.id, !content.isImportant)
      .pipe(
        tap(() => content.isImportant = !content.isImportant),
        tap(() => successAlert('Estatus actualizado'))
      )
      .subscribe();
  }

  showContent(contentId: number): void {
    this.contentService.get(contentId)
      .pipe(
        tap(content => {
          this.contentToShow = content;
          this.toggleModal = true;
        })
      )
      .subscribe();
  }
}
