import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Main } from './layout/main/main';
import { Patients } from './pages/patients/patients';
import { authGuard } from './core/guards/auth-guard';
import { Procedures } from './pages/procedures/procedures';
import { Reports } from './pages/reports/reports';
import { Dashboard } from './pages/dashboard/dashboard';
import { OvarianTissueCryopreservationFreezing } from './pages/freezing/ovarian-tissue-cryopreservation/ovarian-tissue-cryopreservation-freezing';
import { SpermFreezing } from './pages/freezing/sperm-freezing/sperm-freezing';
import { OocyteFreezing } from './pages/freezing/oocyte-freezing/oocyte-freezing';
import { EmbryoFreezing } from './pages/freezing/embryo-freezing/embryo-freezing';
import { OPULiveTracker } from './pages/trakers/opu-operation-tracker/opu-live-tracker';
import { TreatmentWorkflowTracker } from './pages/trakers/treatment-workflow-tracker/treatment-workflow-tracker';

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
            },
            {
                path: 'treatmentWorkflowTracker',
                component: TreatmentWorkflowTracker
            },
            {
                path: 'opuLiveTracker',
                component: OPULiveTracker
            },
            {
                path: 'embryoFreezing',
                component: EmbryoFreezing
            },
            {
                path: 'oocyteFreezing',
                component: OocyteFreezing
            },
            {
                path: 'spermFreezing',
                component: SpermFreezing
            },
            {
                path: 'ovarianTissueCryopreservationFreezing',
                component: OvarianTissueCryopreservationFreezing
            }            
        ]
    }
];
