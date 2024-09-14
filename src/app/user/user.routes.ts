import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";

export const USER_ROUTES: Routes = [
  {
    path: '', component: HomeComponent, children: [
      {
        path: 'contenido',
        loadChildren: () => import('./content/content.routes').then(m => m.CONTENT_ROUTES)
      }
    ]
  },
];
