import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {AdminGuard} from "../auth/guards/admin.guard";

export const ADMIN_ROUTES: Routes = [
  {
    path: '', canActivate: [AdminGuard], component: HomeComponent, children: [
      {
        path: 'equipos',
        loadChildren: () => import('./teams/teams.routes').then(m => m.TEAMS_ROUTES)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'plantillas',
        loadChildren: () => import('./templates/templates.routes').then(m => m.TEMPLATES_ROUTES)
      },
      {
        path: 'contenidos',
        loadComponent: () => import('./content/content.component').then(c => c.ContentComponent)
      }
    ]
  },
];
