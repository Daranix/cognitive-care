import { Component, input } from '@angular/core';
import { Observable } from 'rxjs';
import { Loading } from '../../../utils';
import { PatientDto, PatientSmallDto } from '../../../api';
import { IconComponent } from '../../common/icon/icon.component';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent {
  readonly dataSource = input.required<Loading<PatientSmallDto[]>>();
}
