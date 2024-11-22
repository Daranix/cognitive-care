import { Routes } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { PatientsPageComponent } from './pages/patients-page/patients-page.component';
import { CalendarPageComponent } from './pages/calendar-page/calendar-page.component';
import { PatientDetailsComponent } from './pages/patient-details/patient-details.component';


export const routes: Routes = [
    {
        path: '',
        children: [
            { path: '', redirectTo: 'patients', pathMatch: 'full' },
            { path: 'patients', component: PatientsPageComponent },
            { path: 'calendar', component: CalendarPageComponent },
            { path: 'patient/:id', component: PatientDetailsComponent }
        ],
        component: BaseComponent
    }
];
