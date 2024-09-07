import {Component, OnInit} from '@angular/core';
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
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, NgClass, NgIf, NgOptimizedImage, NgStyle} from "@angular/common";
import {Ripple} from "primeng/ripple";
import {Observable, switchMap, tap} from "rxjs";
import {ContentService} from "../content/services/content.service";
import {ProgressBarModule} from "primeng/progressbar";
import {TokenService} from "../../auth/service/token.service";
import {ContentSyncService} from "../../shared/services/content-sync.service";
import {ContentTree} from "../content/models/content-tree";

@Component({
  selector: 'app-home',
  standalone: true,
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
export class HomeComponent implements OnInit{
  items: MenuItem[] | undefined;
  userAcronyms: string = 'U';
  treeData: any;
  resourceId!: number | undefined;
  previousNode: any;
  constructor(private contenidoService: ContentService,
              private router: Router,
              private tokenService: TokenService,
              private syncContentService: ContentSyncService) {
  }

  ngOnInit() {
    const url = this.router.url;
    const index = url.indexOf('/contenido/');
    if (index !== -1) {
      this.resourceId = +url.substring(index + '/contenido/'.length);
    } else {
      this.resourceId = undefined;
    }

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
      .pipe(switchMap(() => this.getContent$()))
      .subscribe();
  }

  private getContent$(): Observable<ContentTree[]>{
    return this.contenidoService.getContenidosTree()
      .pipe(tap((response) => {
        this.treeData = response;
        this.markActiveNode(this.treeData);
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

  markActiveNode(treeData: any): void {
    if(this.resourceId) {
      this.nodos(treeData);
    }
  }

  goToForm(): void {
    this.router.navigate(['contenido']);
  }

  nodos(treeData: any) {
    if(treeData.length === 0) {
      return;
    }

    treeData.forEach((node: any) => {

      node.expanded = true;
      if(this.isNodeActive(node)) {
        this.previousNode = node;
        this.previousNode.styleClass = 'text-primary font-w-600'
      }

      this.nodos(node.children);
    });
  }

  isNodeActive(node: any): boolean {
    return node.id === this.resourceId;
  }

  private logout(): void {
    this.tokenService.clearOnLogout();
  }
}
