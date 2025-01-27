import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default redirect to login
  { path: 'main', loadChildren: () => import('./pages/entry-pages/entry-pages.module').then(m => m.EntryPagesModule) },
];
