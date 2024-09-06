import { Component } from '@angular/core';
import {SpinnerService} from "../../services/spinner.service";
import {AsyncPipe, NgIf} from "@angular/common";

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
export class SpinnerComponent {
  constructor(public spinnerService: SpinnerService) {}
}
