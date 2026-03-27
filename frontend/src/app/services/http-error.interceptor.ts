// Intercepteur HTTP pour gérer les erreurs :
// - 409 : jour de vote basculé → bandeau animé + rechargement
// - Erreurs réseau (0, timeout) → message clair en français

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { DayBannerService } from './day-banner.service';
import { PollingService } from './polling.service';
import { NetworkErrorService } from './network-error.service';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const dayBannerService = inject(DayBannerService);
  const pollingService = inject(PollingService);
  const networkErrorService = inject(NetworkErrorService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 409 && error.error?.error === 'day_switched') {
        dayBannerService.show();
        pollingService.fetchProposals();
      } else if (error.status === 0 || error.status >= 500) {
        networkErrorService.show('Le serveur est temporairement indisponible. Nouvelle tentative automatique...');
      }
      return throwError(() => error);
    })
  );
};
