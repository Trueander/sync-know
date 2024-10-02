import {Component, OnInit} from '@angular/core';
import {MessageService, PrimeTemplate} from "primeng/api";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {User} from "../../models/user.model";
import {Button} from "primeng/button";
import {UserService} from "../../services/user.service";
import {debounceTime, distinctUntilChanged, filter, tap} from "rxjs";
import {AsyncPipe, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {PageReponse} from "../../../../shared/models/page-reponse";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {IconFieldModule} from "primeng/iconfield";
import {InputIconModule} from "primeng/inputicon";
import {InputTextModule} from "primeng/inputtext";
import {Role} from "../../../../shared/models/role";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'app-user-list',
  standalone: true,
    imports: [
        PrimeTemplate,
        TableModule,
        Button,
        AsyncPipe,
        NgIf,
        RouterLink,
        ToastModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        ReactiveFormsModule,
        TooltipModule
    ],
  providers:[MessageService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  users: User[] = [];
  totalRecords: number = 0;
  pageSize: number = 0;
  page: number = 0;
  searchFormControl: FormControl = new FormControl('');

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(300),
        filter(text => text.length > 2 || text.length === 0),
        tap(() => this.searchUsers())
      ).subscribe();
  }

  searchUsers(event?: TableLazyLoadEvent): void {
    if(event) {
      this.page = event.first! / event.rows!;
      this.pageSize = event.rows!;
    } else {
      this.page = 0;
    }

    this.userService.getUsersPagination(this.page, this.pageSize, this.searchFormControl.value)
      .pipe(
        tap(this.loadPagination)
      )
      .subscribe();
  }

  mapRolesName(roles: Role[]): string {
    return roles.map(role => role.name).join(', ');
  }

  private loadPagination = (response: PageReponse<User>): void => {
    this.users = response.items;
    this.totalRecords = response.totalElements;
  }
}
