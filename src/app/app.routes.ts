import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from './layout/main/main';
import { Patients } from './pages/patients/patients';
import { authGuard } from './core/guards/auth-guard';
import { Procedures } from './pages/procedures/procedures';
import { Reports } from './pages/reports/reports';
import { Dashboard } from './pages/dashboard/dashboard';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '', component: Main,
        canActivate: [authGuard],
        children: [

            {
                path: 'patients',
                component: Patients
            },
            {
                path: 'procedures',
                component: Procedures
            },
            {
                path: 'reports',
                component: Reports
            },
            {
                path: 'dashboard',
                component: Dashboard
            }                            
        ]
    }
];
