import { Component, computed, EventEmitter, inject, signal } from '@angular/core';
import { loading, LOADING_INITIAL_VALUE, routeParamsSignal } from '../../utils';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, distinctUntilChanged, filter, firstValueFrom, map, merge, of, switchMap, tap } from 'rxjs';
import { type AppointmentDto, AppointmentService } from '../../api';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule, type NgForm } from '@angular/forms';
import { HotToastService } from '@ngxpert/hot-toast';
import { formatDate, parse } from 'date-fns';
import { DragAndDropFileComponent } from '@/app/components/common/drag-and-drop-file/drag-and-drop-file.component';
import { ButtonComponent } from '@/app/components/common/button/button.component';
import { SseclientService } from '@/app/services/sseclient.service';

@Component({
  selector: 'app-appointment-details',
  standalone: true,
  imports: [FormsModule, DragAndDropFileComponent, ButtonComponent],
  templateUrl: './appointment-details.component.html',
  styleUrl: './appointment-details.component.scss'
})
export class AppointmentDetailsComponent {

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly appointmentService = inject(AppointmentService);
  private readonly hotToastService = inject(HotToastService);
  private readonly router = inject(Router);

  readonly patientId = routeParamsSignal('patientId');
  readonly appointmentId = routeParamsSignal('appointmentId');
  private readonly forceRefresh = new EventEmitter<void>();
  readonly isUploadingAudio = signal(false);

  readonly audioFile = signal<Blob | undefined>(undefined);
  readonly audioFileUrl = computed(() => URL.createObjectURL(this.audioFile()!));
  readonly wantToUploadNew = signal(false);
  readonly isGeneratingSummaryOfTranscription = signal(false);

  constructor(
    private readonly sseClientService: SseclientService
  ) {}

  private readonly appointment$ = merge(
    this.activatedRoute.params.pipe(
      map((params) => params['appointmentId']),
      distinctUntilChanged() // Only act on changes
    ),
    this.forceRefresh.pipe(
      switchMap(() => this.activatedRoute.params.pipe(map((v) => v['appointmentId'])))
    ),
  ).pipe(
    filter((id) => id !== 'new'),
    switchMap((id) => this.appointmentService.findAppoinmentById({ id }).pipe(loading())),
    filter((v) => !!v.data),
    tap((v) => Object.assign(this.appointmentData, v.data)),
    tap((v) => Object.assign(this.appointmentDay, { date: formatDate(v.data!.date, 'yyyy-MM-dd'), time: formatDate(v.data!.date, 'HH:mm') }))
  );

  readonly appointment = toSignal(this.appointment$, { initialValue: LOADING_INITIAL_VALUE });
  readonly appointmentData: Partial<AppointmentDto> = {};
  readonly appointmentDay: { date?: string, time?: string } = {};

  async save(form: NgForm) {

    const data = this.appointmentData as AppointmentDto; // In a real scenario this would be validated

    this.appointmentData.date = parse(`${this.appointmentDay.date} ${this.appointmentDay.time}`, 'yyyy-MM-dd HH:mm', new Date()).toISOString();


    try {
      const result = await firstValueFrom(this.appointmentService.createOrUpdateAppointment({
        createAppointmentDto: { ...this.appointment().data, ...data, patientId: this.patientId()! }
      }));

      if (this.appointmentId() === 'new') {
        this.router.navigate(['/patient', this.patientId(), 'appointment', result.id])
      } else {
        this.forceRefresh.next();
      }

      this.hotToastService.success('Appointment saved');
    } catch (ex) {
      this.hotToastService.error('Failed to save appointment data');
      console.error('Failed to save appointment data', ex);
    }
  }

  fileChanged(file?: File) {
    this.audioFile.set(file);
  }

  async uploadFile() {

    this.isUploadingAudio.set(true);

    try {
      await firstValueFrom(this.appointmentService.uploadAudioFile({ id: this.appointmentId()!, file: this.audioFile()! }));
      this.forceRefresh.next();
      this.hotToastService.success('Audio uploaded');
      this.wantToUploadNew.set(false);
      this.audioFile.set(undefined);
    } catch(ex) {
      this.hotToastService.error('Failed to upload the audio file');
      console.error('Failed to upload the audio file', ex);
    }

    this.isUploadingAudio.set(false);

  }

  cleanAudioFile() {
    this.audioFile.set(undefined);
    this.wantToUploadNew.set(true);
  }

  async loadAudioFile() {
    
    try {
      const file = await firstValueFrom(this.appointmentService.getAudioForAppointment({ id: this.appointmentId()! }));
      this.audioFile.set(file);
    } catch(ex) {
      console.error('Failed to load the audio file', ex);
      this.hotToastService.error('Failed to load the audio file');
    }
  }

  async generateSessionSummary() {
    this.isGeneratingSummaryOfTranscription.set(true);
    this.appointmentData.transcriptionSummary = '';
    this.sseClientService.summarizeTranscription(this.appointmentId()!)
    .subscribe({
      next: (value) => {
        if(value.eventType === 'text') {
          this.appointmentData.transcriptionSummary += value.text!;
        }
      },
      error: (err) => {
        this.hotToastService.error('Failed to generate the summary for the transcription');
        console.error('Failed to generate the summary for the transcription', err);
        this.isGeneratingSummaryOfTranscription.set(false);
      },
      complete: () => {
        this.isGeneratingSummaryOfTranscription.set(false);
      }
    });
    
  }

}
