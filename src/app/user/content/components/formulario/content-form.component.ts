import {Component, LOCALE_ID, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgIf, NgTemplateOutlet, registerLocaleData} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {catchError, EMPTY, filter, map, switchMap, tap} from "rxjs";
import {InputTextModule} from "primeng/inputtext";
import {ContentService} from "../../services/content.service";
import {Button} from "primeng/button";
import {DividerModule} from "primeng/divider";
import localeEs from '@angular/common/locales/es';
import {ContentSyncService} from "../../../../shared/services/content-sync.service";
import {Content} from "../../models/content";
import {DialogModule} from "primeng/dialog";
import {PreContentModalService} from "../../services/pre-content-modal.service";
import {DialogService} from "primeng/dynamicdialog";
import {UserService} from "../../../../admin/users/services/user.service";
import {TooltipModule} from "primeng/tooltip";
import {errorAlert, successAlert, warningAlert} from "../../../../shared/utils/alert-messages.utils";
import {CkeditorComponent} from "../../../../shared/components/ckeditor/ckeditor.component";

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    InputTextModule,
    Button,
    AsyncPipe,
    DividerModule,
    DatePipe,
    RouterLink,
    DialogModule,
    TooltipModule,
    CkeditorComponent,
    NgTemplateOutlet
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    PreContentModalService,
    DialogService
  ],
  templateUrl: './content-form.component.html',
  styleUrl: './content-form.component.scss'
})
export class ContentFormComponent implements OnInit{
  form!: FormGroup;
  resourceId!: number;
  parentId!: number;
  content!: Content;
  editable: boolean = false;
  isFavoriteForCurrentUser: boolean = false;

  constructor(private contentService: ContentService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private syncContentService: ContentSyncService,
              private modal: PreContentModalService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.loadForm();
    this.loadContentIfExist();
  }

  private verifyFavoriteForCurrentUser(): void {
    this.userService.verifyFavoriteContentExist(this.resourceId)
      .subscribe(response => this.isFavoriteForCurrentUser = response);
  }

  updateFavoriteStatus(): void {
    const observable = this.isFavoriteForCurrentUser ?
      this.userService.removeFavoriteContent(this.resourceId) :
      this.userService.addFavoriteContent(this.resourceId);
    observable.pipe(
      tap(() => {
        this.isFavoriteForCurrentUser = !this.isFavoriteForCurrentUser;
        successAlert(`${this.isFavoriteForCurrentUser ? 'Agregado a' : 'Removido de'} lista de favoritos`)

      })
    ).subscribe();
  }

  updateContent(): void {
    if(this.form.valid) {
      this.contentService.updateContent(this.resourceId, this.form.value)
        .pipe(
          switchMap(() => {
            successAlert('Contenido actualizado');
            return this.router.navigate(['contenido', this.resourceId]);
          }),
          tap(() => this.syncContentService.sync()),
          switchMap(() => this.contentService.get(this.resourceId)),
          tap(this.preloadData)
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
      warningAlert('Verifique los campos');
    }
  }

  goBackToDetail(): void {
    this.htmlContentFC.setValue(this.content.htmlContent);
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
    this.modal.show(this.content);
  }

  private loadContentIfExist(): void {
    this.activatedRoute.paramMap
      .pipe(
        map(this.mapResourceId),
        filter(resourceId => !!resourceId),
        switchMap(id => this.contentService.get(id)),
        catchError(error => {
          if(error.status === 409) errorAlert(error.error.message);
          this.router.navigate(['/']);
          return EMPTY
        }),
        tap(this.preloadData),
        switchMap(() => this.activatedRoute.queryParams),
        tap(queryParams => {
          this.parentId = +queryParams['parentId'];
          this.editable = queryParams['edit'];
          if(this.editable) {
            this.form.patchValue({
              title: this.content.title,
              htmlContent: this.content.htmlContent,
            });
          } else {
            this.verifyFavoriteForCurrentUser();
          }
        })
      ).subscribe();
  }

  private loadForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      htmlContent: new FormControl(null, Validators.required),
      parentId: new FormControl(null),
    });
  }

  private mapResourceId = (params: ParamMap): number => {
    let resourceId = params.get('resourceId');

    if(resourceId) {
      return this.resourceId = +resourceId;
    }

    return 0;
  }

  private preloadData = (resource: Content): void => {
    this.content = resource;
    this.htmlContentFC.setValue(resource.htmlContent);
  }

  get htmlContentFC(): FormControl {
    return this.form.get('htmlContent') as FormControl;
  }
}
