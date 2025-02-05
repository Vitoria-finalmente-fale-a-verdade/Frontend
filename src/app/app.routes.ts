import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NavSideLayoutComponent } from './shared/templates/nav-side-layout/nav-side-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import {authGuard} from './guards/auth.guard';
import {loginGuard} from './guards/login.guard';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard]
  }, // Login page
  {
    path: '',
    component: NavSideLayoutComponent, // Wrapper with Sidebar + Navbar,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
