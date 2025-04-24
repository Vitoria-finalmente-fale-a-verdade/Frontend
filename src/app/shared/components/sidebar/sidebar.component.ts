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
import {faBriefcase, faBuilding, faHome, faLeaf, faSeedling, faUser, faTractor} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

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
    FontAwesomeModule,
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
        faIcon: faHome,
        route: '',
      },
      {
        key: 'users',
        label: 'Usuários',
        faIcon: faUser,
        route: '/users',
        visible: this.authService.isAdmin()
      },
      {
        key: 'admins',
        label: 'Administrar',
        faIcon: faBriefcase,
        items: [
          {
            key: 'properties',
            label: 'Propriedades',
            faIcon: faBuilding,
            route: 'manage/properties'
          },
          {
            key: 'explorations',
            label: 'Explorações',
            faIcon: faSeedling,
            route: 'manage/explorations'
          },
          {
            key: 'permanent-crops',
            label: 'Cultura Permanente',
            faIcon: faLeaf,
            route: 'manage/permanent-crops'
          },
          {
            key: 'permanent-crops',
            label: 'Maquinario',
            faIcon: faTractor,
            route: 'manage/machinery'
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
