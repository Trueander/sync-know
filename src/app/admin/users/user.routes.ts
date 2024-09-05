import { Routes } from '@angular/router';
import {UserListComponent} from "./components/user-list/user-list.component";
import {UserFormComponent} from "./components/user-form/user-form.component";

export const USER_ROUTES: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'crear',
    component: UserFormComponent
  },
  {
    path: 'actualizar/:id',
    component: UserFormComponent
  }
];
