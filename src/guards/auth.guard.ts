import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StorageKeyEnum } from '../enums/storage-keys';

export const refreshTokenGuard: CanActivateFn = () => {
  const router = inject(Router);

  return sessionStorage.getItem(StorageKeyEnum.REFRESH_TOKEN_KEY)
    ? true
    : router.createUrlTree(['/auth/login']);
};
