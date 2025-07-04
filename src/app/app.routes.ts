import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavSideLayoutComponent } from './shared/templates/nav-side-layout/nav-side-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {authGuard} from './shared/guards/auth.guard';
import {loginGuard} from './shared/guards/login.guard';
import {UserListComponent} from './pages/users/user-list/user-list.component';
import {Roles} from './models/role.model';
import {PropertyListComponent} from './pages/manage/property-list/property-list.component';
import {CropListComponent} from './pages/manage/crop-list/crop-list.component';
import { MachineryListComponent } from './pages/manage/machinery-list/machinery-list.component';
import { InventoryItemListComponent } from './pages/manage/inventory-item-list/inventory-item-list.component';
import { StockMovementListComponent } from './pages/manage/stock-movement-list/stock-movement-list.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  },
  {
    path: '',
    component: NavSideLayoutComponent,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: 'Dashboards'
        }
      },
      {
        path: 'users',
        component: UserListComponent,
        data: {
          title: 'Usuários',
          roles: [Roles.ADMIN]
        }
      },
      {
        path: 'manage',
        children: [
          {
            path: 'properties',
            component: PropertyListComponent,
            data: {
              title: 'Propriedades'
            }
          },
          {
            path: 'crops',
            component: CropListComponent,
            data: {
              title: 'Cultura'
            }
          },
          {
            path: 'machinery',
            component: MachineryListComponent,
            data: {
              title: 'Maquinário'
            }
          },
          {
            path: 'inventory-items',
            component: InventoryItemListComponent,
            data: {
              title: 'Inventário'
            }
          },
          {
            path: 'stock-movements',
            component: StockMovementListComponent,
            data: {
              title: 'Movimentações'
            }
          },
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
