import { Routes } from '@angular/router';
import {TemplatesListComponent} from "./components/templates-list/templates-list.component";
import {TemplateFormComponent} from "./components/template-form/template-form.component";

export const TEMPLATES_ROUTES: Routes = [
  {
    path: '',
    component: TemplatesListComponent
  },
  {
    path: 'crear',
    component: TemplateFormComponent
  },
  {
    path: 'actualizar/:id',
    component: TemplateFormComponent
  }
];
