import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./pages/auth/auth-page.component').then((component) => component.AuthPage),
            },
            {
                path: 'register',
                loadComponent: () => import('./pages/register/register-page.component').then((component) => component.RegisterPage),
            }
        ]
        
    },
];
