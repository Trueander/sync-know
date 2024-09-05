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
        loadChildren: () => import('./teams/equipos.routes').then(m => m.EQUIPOS_ROUTES)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES)
      }
    ]
  },
];
