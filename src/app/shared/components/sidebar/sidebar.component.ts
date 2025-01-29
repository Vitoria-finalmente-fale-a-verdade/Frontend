import { Component } from '@angular/core';
import {DrawerModule} from 'primeng/drawer';
import {AvatarModule} from 'primeng/avatar';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {StyleClassModule} from 'primeng/styleclass';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    DrawerModule,
    AvatarModule,
    ButtonModule,
    RippleModule,
    StyleClassModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  visible = false;

  menus = [
    {
      path: 'dashboard',
      title: 'Dashboard',
      icon: 'home'
    },
    {
      path: 'users',
      title: 'Usuários',
      icon: 'user'
    }
  ]

  closeCallback(): void {
    this.visible = false;
  }

  openCallback(): void {
    this.visible = true;
  }
}
