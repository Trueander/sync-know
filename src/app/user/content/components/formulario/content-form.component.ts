import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf, registerLocaleData} from "@angular/common";
import {QuillEditorComponent} from "ngx-quill";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {filter, map, switchMap, tap} from "rxjs";
import {InputTextModule} from "primeng/inputtext";
import {ContentService} from "../../services/content.service";
import {Button} from "primeng/button";
import {DividerModule} from "primeng/divider";
import localeEs from '@angular/common/locales/es';
import {ContentSyncService} from "../../../../shared/services/content-sync.service";

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    NgIf,
    QuillEditorComponent,
    ReactiveFormsModule,
    InputTextModule,
    Button,
    AsyncPipe,
    DividerModule,
    DatePipe,
    RouterLink
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent implements OnInit{
  form!: FormGroup;
  safeHtml!: SafeHtml;
  resourceId!: number;
  parentId!: number;
  content: any;
  editable: boolean = false;

  constructor(private contenidoService: ContentService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private syncContentService: ContentSyncService) {
  }

  ngOnInit(): void {
    this.loadContentIfExist();
  }

  saveContent(): void {
    if(this.form.valid) {
      this.contenidoService.saveContent(this.form.value)
        .pipe(
          switchMap(id =>  this.router.navigate(['contenido', id])),
          tap(() => this.syncContentService.sync())
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  updateContent(): void {
    if(this.form.valid) {
      this.contenidoService.updateContent(this.resourceId, this.form.value)
        .pipe(
          switchMap(() => this.router.navigate(['contenido', this.resourceId])),
          tap(() => this.syncContentService.sync())
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  goBackToDetail(): void {
    this.router.navigate(['contenido', this.resourceId]);
  }

  goToEditContent(): void {
    const currentParams = this.activatedRoute.snapshot.queryParams;
    const newParams = { ...currentParams, edit: true };
    this.editable = true;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: newParams,
      queryParamsHandling: 'merge'
    })
  }

  goToFormWithParentId(): void {
    this.router.navigate(['/contenido'], {queryParams: {padreId: this.resourceId}})
  }

  private loadContentIfExist(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(this.mapResourceId),
        filter(resourceId => !!resourceId),
        switchMap(id => this.contenidoService.get(id)),
        tap(this.preloadData),

      ).subscribe();

    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.parentId = +queryParams['padreId'];
      this.editable = queryParams['edit'];
      this.loadForm();
      if(this.editable) {
        this.form.patchValue({
          title: this.content.title,
          htmlContent: this.content.htmlContent,
        });
      }
    });
  }

  private loadForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      htmlContent: new FormControl(null, Validators.required),
      parentId: new FormControl(this.parentId),
    });
  }

  mapResourceId = (params: ParamMap): number => {
    let resourceId = params.get('resourceId');

    if(resourceId) {
      return this.resourceId = +resourceId;
    }

    return 0;
  }

  preloadData = (resource: any): void => {
    this.content = resource;
    this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(resource.htmlContent);
  }
}
