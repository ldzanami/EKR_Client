import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('../modules/content/content.router').then((router) => router.routes),
    },
    {
        path: 'auth',
        loadChildren: () => import('../modules/auth/auth.router').then((router) => router.routes),
    }
];
