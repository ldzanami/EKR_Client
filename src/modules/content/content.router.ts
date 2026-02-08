import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'default',
                loadComponent: () => import('./pages/default/home-page.component').then((component) => component.HomePage),
            }
        ],
    },
];
