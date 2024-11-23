import { Component, computed, EventEmitter, inject, model, type OnInit, signal } from '@angular/core';
import { Loading, loading, LOADING_INITIAL_VALUE, routeParamsSignal } from '../../utils';
import { FormsModule, type NgForm } from '@angular/forms';
import { type PatientDto, PatientService } from '../../api';
import { distinctUntilChanged, filter, firstValueFrom, map, merge, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { differenceInYears } from 'date-fns';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/common/button/button.component';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, RouterLink],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {

  private readonly patientService = inject(PatientService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly hotToastService = inject(HotToastService);
  private readonly router = inject(Router);

  private readonly forceRefresh = new EventEmitter<void>();

  readonly mode = signal<'edit' | 'view'>('view');
  private readonly mode$ = toObservable(this.mode);
  readonly patientId = routeParamsSignal('id');

  private readonly refresh$ = merge(
    this.mode$.pipe(
      filter((mode) => mode === 'view'),
      switchMap(() => this.activatedRoute.params.pipe(map((v) => v['id'])))
    ),
    this.forceRefresh.pipe(
      switchMap(() => this.activatedRoute.params.pipe(map((v) => v['id'])))
    ),
    this.activatedRoute.params.pipe(
      map((params) => params['id']),
      distinctUntilChanged() // Only act on changes
    ).pipe(
      filter((id) => id !== 'new')
    )
  )

  private patientData$ = this.refresh$.pipe(
    switchMap(
      (id) => 
        this.patientService.findPatientById({ id }).pipe(loading())
      )
  );

  private readonly appointments$ = this.refresh$.pipe(
    switchMap((id) => this.patientService.findAppointments({ patientId: id }).pipe(loading()),)
  );

  readonly appointments = toSignal(this.appointments$, { initialValue: LOADING_INITIAL_VALUE });

  private readonly patientData = toSignal(this.patientData$, { initialValue: LOADING_INITIAL_VALUE });
  readonly patientCurrentData: Partial<PatientDto> = {
    birthDate: new Date().toISOString()
  };

  readonly isSaving = signal(false);

  constructor() {
    toObservable(this.patientData).subscribe((v) => Object.assign(this.patientCurrentData, this.patientData().data || {}));
  }

  ngOnInit(): void {
    if (this.patientId() === 'new') {
      this.mode.set('edit');
    }

  }

  async saveChanges(form: NgForm) {

    this.isSaving.set(true);

    try {
      const data = { ...this.patientData().data!, ...this.patientCurrentData };
      const result = await firstValueFrom(this.patientService.createOrUpdatePatient({
        createPatientDto: data
      }));

      this.hotToastService.success('Data updated succesfully');

      if(this.patientId() === 'new') {
        this.router.navigate(['patient', result.id]);
        this.mode.set('view');
      } else {
        this.forceRefresh.next();
      }

    } catch(ex) {
      console.error('Failed to save the patient data', ex);
      this.hotToastService.error('Unexpected error trying to save the patient information');
    }

    this.isSaving.set(false);

  }

  async removePatient() {

  }

  cancel() {

    if(this.patientId() === 'new') {
      this.router.navigate(['/patients'])
    } else {
      this.mode.set('view');
    }

  }

  calculateAge() {
    return differenceInYears(new Date(), new Date(this.patientCurrentData.birthDate!));
  }

  

}
