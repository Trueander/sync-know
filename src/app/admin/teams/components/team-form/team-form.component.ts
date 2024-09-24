import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {TeamService} from "../../services/team.service";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {MessageService} from "primeng/api";
import {catchError, EMPTY, Observable, tap} from "rxjs";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {Ripple} from "primeng/ripple";
import {ToastModule} from "primeng/toast";
import {Team} from "../../models/team.model";
import {CheckboxModule} from "primeng/checkbox";
import {NgIf} from "@angular/common";
import {errorAlert, successAlert} from "../../../../shared/utils/alert-messages.utils";

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    Button,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    Ripple,
    ToastModule,
    CheckboxModule,
    RouterLink,
    NgIf
  ],
  providers: [MessageService],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.scss'
})
export class TeamFormComponent implements OnInit{
  form: FormGroup;
  teamId: number | null = null;
  addMoreForm: FormControl = new FormControl(false);
  title: string = 'Crear equipo';

  constructor(private teamService: TeamService,
              private messageService: MessageService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(param => {
      let id = param.get('id');
      this.teamId = id !== null ? +id : null;

      if (this.teamId) {
        this.title = 'Actualizar equipo';
        this.teamService.getTeamById(this.teamId)
          .pipe((tap((response: Team) => this.form.get('name')?.setValue(response.name))))
          .subscribe();
      }
    })
  }

  createTeam(): void {
    if(this.form.valid) {
      this.teamService.createTeam(this.form.value)
        .pipe(
          tap(this.validateAddMore),
          catchError(() => this.onError('crear'))
        ).subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  updateDate(): void {
    if(this.form.valid && this.teamId) {
      this.teamService.updateTeam(this.teamId, this.form.value)
        .pipe(
          tap(() => this.onSuccess('Equipo actualizado con éxito')),
          catchError(() => this.onError('editar'))
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  private validateAddMore = (): void => {
    if(this.addMoreForm.value) {
      this.form.reset();
    } else {
      this.onSuccess('Equipo creado con éxito');
      this.router.navigate(['/admin/equipos']);
    }
  }

  private onSuccess = (textDescription: string): void => {
    successAlert(textDescription);
    this.router.navigate(['/admin/equipos']);
  }

  private onError = (textDescription: string): Observable<never> => {
    errorAlert(`Ocurrió un error al ${textDescription} el equipo`)
    return EMPTY;
  }
}
