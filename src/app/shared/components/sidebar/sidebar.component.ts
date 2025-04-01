import {Component, OnInit} from '@angular/core';
import {DrawerModule} from 'primeng/drawer';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AuthService} from '../../../services/auth.service';
import {PrimeNgModule} from '../../modules/prime-ng/prime-ng.module';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    AvatarModule,
    ButtonModule,
    RippleModule,
    StyleClassModule,
    RouterModule,
    PrimeNgModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  visible = false;

  items!: MenuItem[];

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.items = [
      {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'pi pi-home',
        route: '',
      },
      {
        key: 'users',
        label: 'Usuários',
        icon: 'pi pi-user',
        route: '/users',
        visible: this.authService.isAdmin()
      },
      {
        key: 'admins',
        label: 'Administrar',
        icon: 'pi pi-briefcase',
        items: [
          {
            key: 'properties',
            label: 'Propriedades',
            icon: 'pi pi-building',
            route: 'manage/properties'
          },
          {
            key: 'permanentCrops',
            label: 'Culturas Permanentes',
            icon: 'pi pi-hammer',
            route: 'manage/permanent-crops'
          }
        ]
      }
    ];
  }

  private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
    return items.map((menuItem) => {
      menuItem.expanded = expanded;
      if (menuItem.items) {
        menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
      }
      return menuItem;
    });
  }

  closeCallback(): void {
    this.items = this.toggleAllRecursive(this.items, false);
    this.visible = false;
  }

  openCallback(): void {
    this.visible = true;
  }
}
