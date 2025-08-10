import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';
import { Router } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./register/register').then(m => m.RegisterComponent) },
  { path: 'upload', loadComponent: () => import('./upload/upload').then(m => m.UploadComponent), canActivate: [() => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isLoggedIn()) return true;
    router.navigate(['/login']);
    return false;
  }] },
  { path: 'history', loadComponent: () => import('./history/history').then(m => m.HistoryComponent), canActivate: [() => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.isLoggedIn()) return true;
    router.navigate(['/login']);
    return false;
  }] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];