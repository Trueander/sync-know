import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {Team} from "../../../teams/models/team.model";
import {Button} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {TeamService} from "../../../teams/services/team.service";
import {catchError, EMPTY, filter, map, Observable, switchMap, tap} from "rxjs";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {ActivatedRoute, ParamMap, Router, RouterLink} from "@angular/router";
import {RoleService} from "../../../../shared/services/role.service";
import {Role} from "../../../../shared/models/role";
import {errorAlert, successAlert} from "../../../../shared/utils/alert-messages.utils";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    Button,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    AsyncPipe,
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  roles$!: Observable<Role[]>;
  teams$!: Observable<Team[]>;
  userId!: number | null;

  constructor(private userService: UserService,
              private teamService: TeamService,
              private roleService: RoleService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) {
    this.form = this.fb.group({
      firstname: this.fb.control(null, Validators.required),
      lastname: this.fb.control(null, Validators.required),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [Validators.required]),
      teamId: this.fb.control(null),
      roleIds: this.fb.control(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this.roles$ = this.roleService.getRoles();
    this.teams$ = this.teamService.getTeams();

    this.activatedRoute.paramMap
      .pipe(
        map(this.mapId),
        filter(userId => userId !== null),
        switchMap(userId => this.userService.getUserById(userId)),
        tap(userId => this.loadUser(userId))
      )
      .subscribe();
  }

  private mapId = (param: ParamMap): number | null => {
    let id = param.get('id');
    this.userId = id ? +id : null;
    return this.userId;
  }

  private loadUser(user: User): void {
    this.form.patchValue({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      teamId: user.team ? user.team.id : null,
      roleIds: user.roles[0].id
    });

    this.form.get('password')?.clearValidators();
    this.form.get('password')?.updateValueAndValidity();
  }

  saveUser(): void {
    if(this.form.valid) {
      this.form.get('roleIds')?.setValue([this.form.get('roleIds')?.value]);
      const userObservable = this.userId ? this.userService.updateUser(this.userId, this.form.value) : this.userService.createUser(this.form.value);
      userObservable.pipe(
        tap(this.onRegisterSuccess),
        catchError(this.onRegisterError)
      ).subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  private onRegisterSuccess = (): void => {
    successAlert(`Usuario ${this.userId ? 'actualizado':'creado'} satisfactoriamente`);
    this.router.navigate(['/admin/usuarios']);
  }

  private onRegisterError = (error: any): Observable<never> => {
    if(error.status === 409) {
      errorAlert(error.error.message);
    }

    return EMPTY;
  }
}
