import {Component, OnInit} from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import {ButtonModule} from "primeng/button";
import {SplitButtonModule} from "primeng/splitbutton";
import {MenuItem} from "primeng/api";
import {InputTextModule} from "primeng/inputtext";
import { MenubarModule } from 'primeng/menubar';
import {ToastModule} from "primeng/toast";
import {TokenService} from "../../auth/service/token.service";
@Component({
  selector: 'app-home',
  standalone: true,
    imports: [ToolbarModule, ButtonModule, SplitButtonModule, InputTextModule, MenubarModule, ToastModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  items: MenuItem[] | undefined;

  constructor(private tokenService: TokenService) {
  }

  ngOnInit(): void {
    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: '/admin'
      },
      {
        label: 'Equipos',
        icon: 'pi pi-users',
        items: [
          {
            label: 'Listar equipos',
            icon: 'pi pi-list',
            routerLink: '/admin/equipos'
          },
          {
            label: 'Crear equipo',
            icon: 'pi pi-plus',
            routerLink: '/admin/equipos/crear'
          }
        ]
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-user',
        items: [
          {
            label: 'Listar usuarios',
            icon: 'pi pi-list',
            routerLink: '/admin/usuarios'
          },
          {
            label: 'Crear usuario',
            icon: 'pi pi-plus',
            routerLink: '/admin/usuarios/crear'
          }
        ]
      },
      {
        label: 'Cerrar sesión',
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  private logout(): void {
    this.tokenService.clearOnLogout();
  }
}
