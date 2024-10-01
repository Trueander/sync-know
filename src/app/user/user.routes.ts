import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {DashboardComponent} from "./dashboard/dashboard.component";

export const USER_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: '',
        component: DashboardComponent
      },
      {
        path: 'contenido',
        loadChildren: () => import('./content/content.routes').then(m => m.CONTENT_ROUTES)
      }
    ]
  },
];
