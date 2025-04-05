import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavSideLayoutComponent } from './shared/templates/nav-side-layout/nav-side-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {authGuard} from './shared/guards/auth.guard';
import {loginGuard} from './shared/guards/login.guard';
import {UserListComponent} from './pages/users/user-list/user-list.component';
import {Roles} from './models/role.model';
import {PropertyListComponent} from './pages/manage/property-list/property-list.component';
import {ExplorationListComponent} from './pages/manage/exploration-list/exploration-list.component';
import {PermanentCropListComponent} from './pages/manage/permanent-crop-list/permanent-crop-list.component';


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
            path: 'explorations',
            component: ExplorationListComponent,
            data: {
              title: 'Explorações'
            }
          },
          {
            path: 'permanent-crops',
            component: PermanentCropListComponent,
            data: {
              title: 'Cultura Permanente'
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
