import {Injectable, OnDestroy} from '@angular/core';
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {SearchContentComponent} from "../components/search-content/search-content.component";

@Injectable({
  providedIn: 'root'
})
export class SearchContentModalService  implements OnDestroy {
  ref: DynamicDialogRef | undefined;

  constructor(public dialogService: DialogService) {}

  show(): void {
    this.ref = this.dialogService.open(SearchContentComponent, {
      showHeader: false,
      dismissableMask: true,
      width: '650px',
      contentStyle: {paddingTop: '28px', borderRadius: '6px', overflow: 'inherit'},
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      }
    });
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
