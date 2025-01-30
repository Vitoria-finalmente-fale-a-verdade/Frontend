import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { NavSideLayoutComponent } from './shared/templates/nav-side-layout/nav-side-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }, // Login page
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }, // Default redirect to login
  {
    path: 'dashboard',
    component: NavSideLayoutComponent, // Wrapper with Sidebar + Navbar
    children: [
      {
        path: '',
        component: DashboardComponent
      }
    ]
  }
];
