import { Component } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patient-list-tools',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './patient-list-tools.component.html',
  styleUrl: './patient-list-tools.component.scss'
})
export class PatientListToolsComponent {

}
