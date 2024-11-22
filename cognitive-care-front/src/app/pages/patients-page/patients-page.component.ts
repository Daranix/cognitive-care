import { Component, inject, signal } from '@angular/core';
import { PatientListComponent } from '../../components/patients-page/patient-list/patient-list.component';
import { PatientListToolsComponent } from '../../components/patients-page/patient-list-tools/patient-list-tools.component';
import { PaginatorComponent } from '../../components/patients-page/paginator/paginator.component';
import { PatientService } from '../../api';
import { loading, LOADING_INITIAL_VALUE } from '../../utils';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-patients-page',
  standalone: true,
  imports: [PatientListToolsComponent, PatientListComponent, PaginatorComponent],
  templateUrl: './patients-page.component.html',
  styleUrl: './patients-page.component.scss'
})
export class PatientsPageComponent {

  private readonly patientService = inject(PatientService);

  readonly page = signal(1);
  readonly total = signal(0);
  readonly limit = 20;

  readonly patientList$ = this.patientService.searchPatients().pipe(loading());
  readonly patientList = toSignal(this.patientList$, { initialValue: LOADING_INITIAL_VALUE });

  onPageChanged({ page }: { page: number }) {
    this.page.set(page);
  }

  

}
