import {Component, OnInit} from '@angular/core';
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {Team} from "../../models/team.model";
import {Button} from "primeng/button";
import {EquipoService} from "../../services/equipo.service";
import {catchError, debounceTime, distinctUntilChanged, EMPTY, filter, Observable, tap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {PageReponse} from "../../../../shared/models/page-reponse";
import {errorAlert, successAlert} from "../../../../shared/utils/alert-messages.utils";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import Swal from "sweetalert2";
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-equipos-list',
  standalone: true,
  imports: [
    TableModule,
    Button,
    NgIf,
    AsyncPipe,
    RouterLink,
    ToastModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ReactiveFormsModule
  ],
  templateUrl: './equipos-list.component.html',
  styleUrl: './equipos-list.component.scss'
})
export class EquiposListComponent implements OnInit{
  teams: Team[] = [];
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  searchFormControl: FormControl = new FormControl('');

  constructor(private teamService: EquipoService) {
  }

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(text => text.length > 2 || text.length === 0),
        tap(() => this.searchTeams())
      ).subscribe();
  }

  searchTeams(event?: TableLazyLoadEvent): void {
    if(event) {
      this.page = event.first! / event.rows!;
      this.pageSize = event.rows!;
    } else {
      this.page = 0;
    }

    this.teamService.getTeamsPagination(this.page, this.pageSize, this.searchFormControl.value)
      .pipe(
        tap(this.loadPagination)
      )
      .subscribe();
  }

  deleteTeam(idEquipo: number): void {
    Swal.fire({
      title: `¿Está seguro de eliminar el equipo?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3B82F6",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {

        this.teamService.deleteTeamById(idEquipo)
          .pipe(
            tap(this.onSuccessDelete),
            catchError(this.onErrorDelete)
          )
          .subscribe();
      }
    });
  }

  private loadPagination = (response: PageReponse<Team>): void => {
    this.teams = response.items;
    this.totalRecords = response.totalElements;
  }

  private onSuccessDelete = (): void => {
    successAlert('Equipo eliminado con éxito');
    this.searchTeams();
  }

  private onErrorDelete = (): Observable<never> => {
    errorAlert('Ocurrió un error al eliminar al equipo');
    return EMPTY;
  }
}
