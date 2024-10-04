import {Component, OnDestroy, OnInit} from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {TagModule} from "primeng/tag";
import {DividerModule} from "primeng/divider";
import {PanelModule} from "primeng/panel";
import {UserService} from "../../admin/users/services/user.service";
import {Subscription, switchMap, tap} from "rxjs";
import {Content} from "../content/models/content";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {User} from "../../admin/users/models/user.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    AvatarModule,
    TagModule,
    DividerModule,
    PanelModule,
    AsyncPipe,
    RouterLink,
    NgIf,
    InputTextModule,
    ReactiveFormsModule,
    DatePipe
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit, OnDestroy {
  contentCreatedByUser!: Content[];
  contentCreatedByUserFilter: Content[] = [];
  userId: number | null = null;
  filterOwnContentFC: FormControl = new FormControl('');
  favoriteContent!: Content[];
  user!: User;
  subscription!: Subscription;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.loadData();
    this.subscription = this.filterOwnContentFC
      .valueChanges
      .subscribe((searchTerm: string) => {
        if (!searchTerm) {
          this.contentCreatedByUserFilter = [...this.contentCreatedByUser];
        } else {
          this.contentCreatedByUserFilter = this.contentCreatedByUser.filter(content =>
            content.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      })
  }

  private loadData(): void {
    this.activatedRoute.paramMap
      .pipe(
        tap(params => {
          let userId = params.get('userId');
          this.userId = userId ? +userId : null;
        }),
        switchMap(() => {
          return this.userId ? this.userService.getUserById(this.userId) : this.userService.getCurrentUser();
        }),
        tap((user: User) => this.user = user)
      )
      .subscribe();
  }

  loadContentCreatedByUser(collapsed: boolean): void {
    if(!collapsed && !this.contentCreatedByUser) {
      this.userService.getContentCreatedByUser(this.userId)
        .subscribe(response => this.contentCreatedByUserFilter = this.contentCreatedByUser = response);
    }
  }

  loadFavoriteContent(collapsed: boolean): void {
    if(!collapsed && !this.favoriteContent) {
      this.userService.getFavoriteContentByUser()
        .subscribe(response => this.favoriteContent = response);
    }
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
