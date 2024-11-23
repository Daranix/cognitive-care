import { Component, input } from '@angular/core';
import { Observable } from 'rxjs';
import type { Loading } from '../../../utils';
import { PatientDto, type PatientSmallDto } from '../../../api';
import { IconComponent } from '../../common/icon/icon.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [IconComponent, RouterLink],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent {
  readonly dataSource = input.required<Loading<PatientSmallDto[]>>();
}
