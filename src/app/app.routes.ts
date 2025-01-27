import { Routes } from '@angular/router';
import { LoginComponent } from './core/login/login.component';
import { EntryPagesModule } from './pages/entry-pages/entry-pages.module';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Login page
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Default redirect to login
  { path: 'main', loadChildren: () => import('./pages/entry-pages/entry-pages.module').then(m => m.EntryPagesModule) },
];
