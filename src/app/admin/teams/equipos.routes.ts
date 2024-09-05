import { Routes } from '@angular/router';
import {EquiposListComponent} from "./components/equipos-list/equipos-list.component";
import {TeamFormComponent} from "./components/crear/team-form.component";

export const EQUIPOS_ROUTES: Routes = [
  {
    path: '',
    component: EquiposListComponent
  },
  {
    path: 'crear',
    component: TeamFormComponent
  },
  {
    path: 'actualizar/:id',
    component: TeamFormComponent
  }
];
