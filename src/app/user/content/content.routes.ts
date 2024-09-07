import {Routes} from "@angular/router";
import {ContentFormComponent} from "./components/formulario/content-form.component";

export const CONTENT_ROUTES: Routes = [
  {
    path: '', component: ContentFormComponent,
  },
  {
    path: ':resourceId', component: ContentFormComponent,
  },
];
