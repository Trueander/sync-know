import {Component, OnInit} from '@angular/core';
import {TemplateService} from "../../services/template.service";
import {catchError, debounceTime, distinctUntilChanged, EMPTY, filter, Observable, tap} from "rxjs";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {Template} from "../../models/template";
import {PageReponse} from "../../../../shared/models/page-reponse";
import {errorAlert, successAlert} from "../../../../shared/utils/alert-messages.utils";
import Swal from "sweetalert2";
import {Button} from "primeng/button";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {PrimeTemplate} from "primeng/api";
import {RouterLink} from "@angular/router";
import {DatePipe} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-templates-list',
  standalone: true,
    imports: [
        Button,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        PrimeTemplate,
        ReactiveFormsModule,
        TableModule,
        RouterLink,
        DatePipe,
        TooltipModule
    ],
  templateUrl: './templates-list.component.html',
  styleUrl: './templates-list.component.scss'
})
export class TemplatesListComponent implements OnInit{
  templates: Template[] = [];
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  searchFormControl: FormControl = new FormControl('');

  constructor(private templateService: TemplateService) {
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(text => text.length > 2 || text.length === 0),
        tap(() => this.searchTemplates())
      ).subscribe();
  }

  searchTemplates(event?: TableLazyLoadEvent): void {
    if(event) {
      this.page = event.first! / event.rows!;
      this.pageSize = event.rows!;
    } else {
      this.page = 0;
    }

    this.templateService.getTemplatesPagination(this.page, this.pageSize, this.searchFormControl.value)
      .pipe(
        tap(this.loadPagination)
      )
      .subscribe();
  }

  deleteTemplate(templateId: number): void {
    Swal.fire({
      title: `¿Está seguro de eliminar la plantilla?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.templateService.deleteTemplateById(templateId)
          .pipe(
            tap(this.onSuccessDelete),
            catchError(this.onErrorDelete)
          )
          .subscribe();
      }
    });
  }

  private loadPagination = (response: PageReponse<Template>): void => {
    this.templates = response.items;
    this.totalRecords = response.totalElements;
  }

  private onSuccessDelete = (): void => {
    successAlert('Plantilla eliminada con éxito');
    this.searchTemplates();
  }

  private onErrorDelete = (): Observable<never> => {
    errorAlert('Ocurrió un error al eliminar la plantilla');
    return EMPTY;
  }
}
