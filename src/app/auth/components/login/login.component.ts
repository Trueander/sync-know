import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CardModule} from "primeng/card";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {catchError, EMPTY, Observable, tap} from "rxjs";
import {TokenService} from "../../service/token.service";
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [InputTextModule, ButtonModule, FloatLabelModule, ReactiveFormsModule, CardModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  form: FormGroup;
  errorMessage: boolean = false;

  constructor(private authService: AuthService,
              private tokenService: TokenService,
              private router: Router) {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8)])
    });
  }

  register(): void {
    if(this.form.valid) {
      this.errorMessage = false;
      this.authService.login(this.form.value)
        .pipe(
          tap((response) => this.onSuccess(response.token)),
          catchError(this.onError)
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }

  private onSuccess = (token: string): void => {
    this.errorMessage = false;
    this.tokenService.setToken(token);
    this.redirectOnRole();
  }

  private onError = (): Observable<never> => {
    this.errorMessage = true;
    return EMPTY;
  }

  private redirectOnRole = (): void => {
    const roles = this.tokenService.getRoles();
    if(roles.includes('ADMIN')) {
      this.router.navigate(['/admin/equipos']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
