import { Component } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';

@Component({
  selector: 'app-patient-list-tools',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './patient-list-tools.component.html',
  styleUrl: './patient-list-tools.component.scss'
})
export class PatientListToolsComponent {

}
