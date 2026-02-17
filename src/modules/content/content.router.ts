import { Routes } from '@angular/router';
import { refreshTokenGuard } from '../../guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: '/default',
            },
            {
                path: 'default',
                loadComponent: () => import('./pages/default/home-page.component').then((component) => component.HomePage),
            }
        ],
        canActivate: [refreshTokenGuard],
    },
];
