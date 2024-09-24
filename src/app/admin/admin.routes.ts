import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const ADMIN_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '', component: DashboardComponent
      },
      {
        path: 'equipos',
        loadChildren: () => import('./teams/teams.routes').then(m => m.TEAMS_ROUTES)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'templates',
        loadChildren: () => import('./templates/templates.routes').then(m => m.TEMPLATES_ROUTES)
      }
    ]
  },
];
