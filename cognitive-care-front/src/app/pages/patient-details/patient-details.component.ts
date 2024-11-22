import { Component, OnInit, signal } from '@angular/core';
import { routeParamsSignal } from '../../utils';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [],
  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {


  readonly mode = signal<'edit' | 'view'>('view');
  readonly patientId = routeParamsSignal('id');

  ngOnInit(): void {

    if (this.patientId() === 'new') {
      this.mode.set('edit');
    }

  }

  

}
