// Configuration du routage Angular
// /welcome — page d'accueil pour la saisie du profil
// /home — page principale protégée par le ProfileGuard

import { Routes } from '@angular/router';
import { profileGuard } from './guards/profile.guard';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./pages/welcome/welcome.component').then(m => m.WelcomeComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [profileGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
