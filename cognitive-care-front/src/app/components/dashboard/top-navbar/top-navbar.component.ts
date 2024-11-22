import { Component, output } from '@angular/core';
import { IconComponent } from '../../common/icon/icon.component';

@Component({
  selector: 'app-top-navbar',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './top-navbar.component.html',
  styleUrl: './top-navbar.component.scss'
})
export class TopNavbarComponent {

  toggleSidebar = output();

}
