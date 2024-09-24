import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpinnerService} from "../../services/spinner.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Observable, Subscription} from "rxjs";

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  isActive: boolean = false;
  subscription!: Subscription;
  constructor(public spinnerService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.spinnerService
      .isLoading$
      .subscribe(item => this.isActive);
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
