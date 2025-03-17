import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { NavSideLayoutComponent } from './shared/templates/nav-side-layout/nav-side-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {authGuard} from './shared/guards/auth.guard';
import {loginGuard} from './shared/guards/login.guard';
import {UserListComponent} from './pages/users/user-list/user-list.component';
import { ExplorationListComponent } from './pages/explorations/exploration-list/exploration-list.component';
import {Roles} from './models/role.model';


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
        path: 'explorations',
        component: ExplorationListComponent,
        data: {
          title: 'Explorações',
          roles: [Roles.ADMIN]
        }
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
