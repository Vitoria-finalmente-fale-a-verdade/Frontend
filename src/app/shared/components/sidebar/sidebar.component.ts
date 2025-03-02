import { Component } from '@angular/core';
import {DrawerModule} from 'primeng/drawer';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SidebarMenuModel} from '../../../models/sidebar-menu.model';
import {IsAuthorizedDirective} from '../../directives/is-authorized.directive';
import {Roles} from '../../../models/role.model';

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
    IsAuthorizedDirective,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  visible = false;

  menus: SidebarMenuModel[] = [
    {
      path: '',
      title: 'Dashboard',
      icon: 'home'
    },
    {
      path: 'users',
      title: 'Usuários',
      icon: 'user',
      roles: [Roles.ADMIN]
    }
  ]

  closeCallback(): void {
    this.visible = false;
  }

  openCallback(): void {
    this.visible = true;
  }
}
