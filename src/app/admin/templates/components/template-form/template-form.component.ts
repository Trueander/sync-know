import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {Button} from "primeng/button";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {QuillEditorComponent} from "ngx-quill";
import {TeamService} from "../../../teams/services/team.service";
import {filter, map, Observable, switchMap, tap} from "rxjs";
import {Team} from "../../../teams/models/team.model";
import {MultiSelectModule} from "primeng/multiselect";
import {ChipModule} from "primeng/chip";
import {TemplateService} from "../../services/template.service";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {successAlert} from "../../../../shared/utils/alert-messages.utils";
import {Template} from "../../models/template";

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    Button,
    NgIf,
    QuillEditorComponent,
    MultiSelectModule,
    AsyncPipe,
    ChipModule,
    NgForOf,
    RouterLink
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss'
})
export class TemplateFormComponent implements OnInit {
  form: FormGroup;
  teams$!: Observable<Team[]>;
  templateId: number | null = null;
  title: string = 'Crear plantilla';

  constructor(private teamService: TeamService,
              private templateService: TemplateService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
    this.form = new FormGroup({
      title: new FormControl(null, Validators.required),
      htmlContent: new FormControl(null, Validators.required),
      teamsIds: new FormControl<Team[]>([])
    });
  }


  ngOnInit(): void {
    this.teams$ = this.teamService.getTeams();

    this.activatedRoute.paramMap
      .pipe(
        map(this.mapId),
        filter(userId => userId !== null),
        switchMap(userId => this.templateService.getTemplateById(userId)),
        tap(userId => this.loadTemplate(userId))
      )
      .subscribe();
  }

  private mapId = (param: ParamMap): number | null => {
    let id = param.get('id');
    this.templateId = id ? +id : null;
    return this.templateId;
  }

  private loadTemplate = (template: Template): void => {
    this.form.setValue({
      title: template.title,
      htmlContent: template.htmlContent,
      teamsIds: template.teams.map(item => item.id)
    });
  }

  saveTemplate(): void {
    if(this.form.valid) {
      const value = {...this.form.value};
      const observable = this.templateId ?
        this.templateService.updateTemplate(this.templateId, value) :
        this.templateService.createTemplate(value);

      observable.pipe(
        tap(() => successAlert(`Plantilla ${this.templateId ? 'creada' : 'editada'} con éxito`)),
        switchMap(() => this.router.navigate(['/admin/templates']))
      ).subscribe();

    } else {
      this.form.markAllAsTouched();
    }
  }
}
