import { Component, computed, EventEmitter, inject, model, type OnInit, signal } from '@angular/core';
import { Loading, loading, LOADING_INITIAL_VALUE, routeParamsSignal } from '../../utils';
import { FormsModule, type NgForm } from '@angular/forms';
import { CognitiveScoreDto, type PatientDto, PatientService, PredictionsService } from '../../api';
import { distinctUntilChanged, filter, firstValueFrom, map, merge, Observable, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { differenceInYears } from 'date-fns';
import { HotToastService } from '@ngxpert/hot-toast';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from '../../components/common/button/button.component';
import { Dialog } from '@angular/cdk/dialog';
import { CognitiveScoreDialogComponent } from '@/app/cognitive-score-dialog/cognitive-score-dialog.component';
import { IconComponent } from '@/app/components/common/icon/icon.component';
import { GaugeComponent } from '@/app/components/gauge/gauge.component';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [FormsModule, DatePipe, ButtonComponent, RouterLink, IconComponent, GaugeComponent],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {

  private readonly patientService = inject(PatientService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly hotToastService = inject(HotToastService);
  private readonly router = inject(Router);
  private readonly predictionService = inject(PredictionsService);

  private readonly forceRefresh = new EventEmitter<void>();

  readonly mode = signal<'edit' | 'view'>('view');
  private readonly mode$ = toObservable(this.mode);
  readonly patientId = routeParamsSignal('id');
  readonly dialog = inject(Dialog);

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

  private readonly patientData$ = this.refresh$.pipe(
    switchMap(
      (id) => 
        this.patientService.findPatientById({ id }).pipe(loading())
      )
  );
  private readonly patientData = toSignal(this.patientData$, { initialValue: LOADING_INITIAL_VALUE });


  private readonly appointments$ = this.refresh$.pipe(
    switchMap((id) => this.patientService.findAppointments({ patientId: id }).pipe(loading()))
  );
  readonly appointments = toSignal(this.appointments$, { initialValue: LOADING_INITIAL_VALUE });

  private readonly cognitiveScores$ = this.refresh$.pipe(
    switchMap(
      (id) => this.patientService.findCognitiveScores({ patientId: id }).pipe(loading())
    )
  )
  readonly cognitiveScores = toSignal(this.cognitiveScores$, { initialValue: LOADING_INITIAL_VALUE });

  private readonly riskPrediction$ = this.refresh$.pipe(
    switchMap(
      (id) => this.predictionService.findPredictionsFromPatient({ patientId: id }).pipe(loading())
    )
  );

  readonly predictions = toSignal(this.riskPrediction$, { initialValue: LOADING_INITIAL_VALUE })

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

  openEvaluationDialog(cognitiveScore?: CognitiveScoreDto) {

      const dialogRef = this.dialog.open<string>(CognitiveScoreDialogComponent, {
        width: '50%',
        data: { patientId: this.patientId(), cognitiveScore },
      });
  
      dialogRef.closed.subscribe(result => {
        if(result === 'success') {
          this.hotToastService.success('Record created');
          this.forceRefresh.next();
        }
      });
  }

  

}
