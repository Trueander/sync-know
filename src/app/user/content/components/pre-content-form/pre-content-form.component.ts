import {Component, OnInit} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {NgClass, NgIf} from "@angular/common";
import {MenuItem} from "primeng/api";
import {Content} from "../../models/content";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Subject, switchMap, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {ContentService} from "../../services/content.service";
import {ContentSyncService} from "../../../../shared/services/content-sync.service";

@Component({
  selector: 'app-pre-content-form',
  standalone: true,
  imports: [
    DialogModule,
    Button,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    BreadcrumbModule,
    NgClass,
    NgIf
  ],
  templateUrl: './pre-content-form.component.html',
  styleUrl: './pre-content-form.component.scss'
})
export class PreContentFormComponent implements OnInit{
  contentForm: FormGroup;
  parentContent!: Content;
  items: MenuItem[] | undefined;
  newItem!: MenuItem;
  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private config: DynamicDialogConfig,
              public dialogRef: DynamicDialogRef,
              private router: Router,
              private contentService: ContentService,
              private syncContentService: ContentSyncService) {
    this.contentForm = new FormGroup({
      title: new FormControl(null, Validators.required),
      htmlContent: new FormControl(''),
      parentId: new FormControl(null)
    });
  }

  ngOnInit(): void {
    this.newItem = {label: ''}
    if(this.config.data && this.config.data.parentContent) {
      this.loadParent(this.config.data.parentContent);
    } else {
      this.items = [{icon: 'pi pi-home', tooltip: 'Esta será la ruta base del nuevo contenido'}, this.newItem];
    }
    this.listenToTitle();
  }

  private listenToTitle(): void {
    const title = this.contentForm.get('title');
    if (title) {
      title.valueChanges
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(text => this.newItem.label = text);
    }
  }

  createContentAndRedirectToEdit(): void {
    if(this.contentForm.valid) {
      this.contentService.saveContent(this.contentForm.value)
        .pipe(
          switchMap(id =>  this.router.navigate(['contenido', id], { queryParams: { edit: true } })),
          tap(() => this.syncContentService.sync()),
          tap(() => this.dialogRef.close())
        )
        .subscribe();
    } else {
      this.contentForm.markAllAsTouched();
    }
  }

  private loadParent = (content: Content): void => {
    this.items = [
      {icon: 'pi pi-home'},
      {label: '...'},
      {label: content.title, styleClass: 'text-primary', tooltip: 'Esta será la ruta base del nuevo contenido'},
      this.newItem
    ];
    this.parentContent = content;
    this.contentForm.get('parentId')?.setValue(this.parentContent.id);
  }
}
