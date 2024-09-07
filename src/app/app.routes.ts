import { Routes } from '@angular/router';
import {LoginGuard} from "./auth/guards/login.guard";
import {AuthGuard} from "./auth/guards/auth.guard";
import {AdminGuard} from "./auth/guards/admin.guard";

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [LoginGuard],
    loadComponent: () => import('./auth/components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canMatch: [AuthGuard],
    canActivate: [AdminGuard],
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '',
    canMatch: [AuthGuard],
    loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: '**', redirectTo: '/login', pathMatch: 'full'
  }
];
