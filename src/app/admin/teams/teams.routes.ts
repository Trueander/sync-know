import { Routes } from '@angular/router';
import {TeamsListComponent} from "./components/teams-list/teams-list.component";
import {TeamFormComponent} from "./components/team-form/team-form.component";

export const TEAMS_ROUTES: Routes = [
  {
    path: '',
    component: TeamsListComponent
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
