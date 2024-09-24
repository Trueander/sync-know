import {Injectable, OnDestroy} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {PreContentFormComponent} from "../components/pre-content-form/pre-content-form.component";
import {Content} from "../models/content";

@Injectable({
  providedIn: 'root'
})
export class PreContentModalService implements OnDestroy {
  ref: DynamicDialogRef | undefined;
  constructor(public dialogService: DialogService) {
  }

  show(parentContent?: Content): void {
    this.ref = this.dialogService.open(PreContentFormComponent, {
      header: 'Crear nuevo contenido',
      width: '700px',
      contentStyle: { overflow: 'auto' },
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: {
        parentContent: parentContent
      }
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
