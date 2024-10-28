import {Component, OnInit} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {Button} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {BreadcrumbModule} from "primeng/breadcrumb";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {MenuItem} from "primeng/api";
import {Content} from "../../models/content";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {Observable, Subject, switchMap, takeUntil, tap} from "rxjs";
import {Router} from "@angular/router";
import {ContentService} from "../../services/content.service";
import {ContentSyncService} from "../../../../shared/services/content-sync.service";
import {TemplateService} from "../../../../admin/templates/services/template.service";
import {Template} from "../../../../admin/templates/models/template";
import {CardModule} from "primeng/card";
import {DividerModule} from "primeng/divider";
import {CkeditorComponent} from "../../../../shared/components/ckeditor/ckeditor.component";
import {successAlert, warningAlert} from "../../../../shared/utils/alert-messages.utils";

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
    NgIf,
    AsyncPipe,
    NgForOf,
    CardModule,
    DividerModule,
    CkeditorComponent
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
  templates$!: Observable<Template[]>;
  visible: boolean = false;
  selectedTemplate!: Template | undefined;
  title: string ='';
  htmlContentFCAux: FormControl = new FormControl('');

  constructor(private config: DynamicDialogConfig,
              public dialogRef: DynamicDialogRef,
              private router: Router,
              private contentService: ContentService,
              private syncContentService: ContentSyncService,
              private templateService: TemplateService) {
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
    this.templates$ = this.templateService.getTemplates();
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
          switchMap(id =>  {
            successAlert('Contenido creado')
            return this.router.navigate(['contenido', id], { queryParams: { edit: true } });
          }),
          tap(() => this.syncContentService.sync()),
          tap(() => this.dialogRef.close())
        )
        .subscribe();
    } else {
      this.contentForm.markAllAsTouched();
      warningAlert('Verifique los campos');
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

  showTemplate(template: Template, event: Event): void {
    event.stopPropagation();
    this.visible = true;
    this.htmlContentFCAux.setValue(template.htmlContent);
    this.title = template.title;
  }

  selectTemplate(template: Template): void {
    if(this.selectedTemplate && this.selectedTemplate.id !== template.id) {
      this.contentForm.get('htmlContent')?.setValue(template.htmlContent);
      this.selectedTemplate = template;
    } else if (this.selectedTemplate && this.selectedTemplate.id === template.id) {
      this.selectedTemplate = undefined;
      this.contentForm.get('htmlContent')?.setValue('');
    } else {
      this.contentForm.get('htmlContent')?.setValue(template.htmlContent);
      this.selectedTemplate = template;
    }

    this.htmlContentFCAux.setValue(this.contentForm.get('htmlContent')?.value);
  }
}
