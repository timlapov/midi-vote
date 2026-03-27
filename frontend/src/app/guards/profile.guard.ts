// Guard qui redirige vers /welcome si le prénom n'est pas défini
// Bloque l'accès aux routes protégées tant que le profil est incomplet

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const profileGuard: CanActivateFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isProfileComplete()) {
    return true;
  }

  return router.createUrlTree(['/welcome']);
};
