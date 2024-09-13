import {Component, OnDestroy, OnInit} from '@angular/core';
import {SplitButtonModule} from "primeng/splitbutton";
import {ToolbarModule} from "primeng/toolbar";
import {InputTextModule} from "primeng/inputtext";
import {MenuItem} from "primeng/api";
import {TreeModule} from "primeng/tree";
import {AvatarModule} from "primeng/avatar";
import {MenuModule} from "primeng/menu";
import {BadgeModule} from "primeng/badge";
import {DividerModule} from "primeng/divider";
import {QuillConfigModule} from "./quill-config";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {Ripple} from "primeng/ripple";
import {map, Observable, Subject, switchMap, takeUntil, tap} from "rxjs";
import {ContentService} from "../content/services/content.service";
import {ProgressBarModule} from "primeng/progressbar";
import {TokenService} from "../../auth/service/token.service";
import {ContentSyncService} from "../../shared/services/content-sync.service";
import {ContentTree} from "../content/models/content-tree";
import {PreContentModalService} from "../content/services/pre-content-modal.service";
import {DialogService} from "primeng/dynamicdialog";

@Component({
  selector: 'app-home',
  standalone: true,
  providers: [PreContentModalService, DialogService],
  imports: [
    SplitButtonModule,
    ToolbarModule,
    InputTextModule,
    TreeModule,
    AvatarModule,
    MenuModule,
    BadgeModule,
    DividerModule,
    QuillConfigModule,
    ReactiveFormsModule,
    NgIf,
    Ripple,
    AsyncPipe,
    NgClass,
    NgStyle,
    ProgressBarModule,
    NgOptimizedImage
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
  items: MenuItem[] | undefined;
  userAcronyms: string = 'U';
  treeData: ContentTree[] = [];
  resourceId!: number | undefined;
  previousNode!: ContentTree;
  unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private contenidoService: ContentService,
              private router: Router,
              private tokenService: TokenService,
              private syncContentService: ContentSyncService,
              private modal: PreContentModalService) {
  }

  ngOnInit(): void {
    this.getContent$().subscribe();
    this.loadUserData();

    this.items = [
      {
        label: 'Configuración',
        icon: 'pi pi-cog'
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];

    this.syncContentService.syncListContent$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.getContent$()))
      .subscribe();
  }

  private saveResourceIdIfExist$(): void {
    const url = this.router.url;
    const index = url.indexOf('/contenido/');
    if (index !== -1) {
      const afterContent = url.substring(index + '/contenido/'.length);
      const idString = afterContent.split('?')[0];
      this.resourceId = +idString;
    } else {
      this.resourceId = undefined;
    }
  }

  private getContent$(): Observable<ContentTree[]>{
    return this.contenidoService.getContenidosTree()
      .pipe(
        takeUntil(this.unsubscribe$),
        map(this.addParentToChildren),
        tap((response) => {
          this.treeData = [];
          this.saveResourceIdIfExist$();
          this.markActiveNode(response);
          this.treeData = response;
      }));
  }

  private loadUserData(): void {
    this.userAcronyms = this.tokenService.getFullNameAcronyms();
  }

  nodeSelect(nodo: any, element: any): void {
    this.router.navigate(['/contenido/', nodo.node.id]);
    if(this.previousNode) {
      this.previousNode.styleClass = '';
    }
  }

  markActiveNode(treeData: ContentTree[]): void {
    if(this.resourceId) {
      this.nodos(treeData);
    }
  }

  goToForm(): void {
    this.modal.show();
  }

  nodos(treeData: ContentTree[]) {

    if(treeData.length === 0) {
      return;
    }

    treeData.forEach((node: ContentTree) => {

      if(this.isNodeActive(node)) {
        this.previousNode = node;
        this.previousNode.styleClass = 'active-node';
        this.expandAllParentItems(node);
      }

      this.nodos(node.children);
    });
  }

  private expandAllParentItems(item: ContentTree): void {
    if(item.parent) {
      item.parent.expanded = true;
      this.expandAllParentItems(item.parent);
    }
  }

  isNodeActive(node: ContentTree): boolean {
    return node.id === this.resourceId;
  }

  private logout(): void {
    this.tokenService.clearOnLogout();
  }

  private addParentToChildren = (contentTree: ContentTree[]): ContentTree[] => {
    contentTree.forEach(item => {
      item.children.forEach(itemChild => {
        itemChild.parent = item;
        this.addParentToChildren([itemChild]);
      });
    });
    return contentTree;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
