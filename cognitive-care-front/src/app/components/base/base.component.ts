import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopNavbarComponent } from '../dashboard/top-navbar/top-navbar.component';
import { SidebarComponent } from '../dashboard/sidebar/sidebar.component';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [TopNavbarComponent, RouterOutlet, SidebarComponent],
  templateUrl: './base.component.html',
  styleUrl: './base.component.scss'
})
export class BaseComponent {
  sidebarOpen = signal(false)

  toggleSidebarHandle() {
    this.sidebarOpen.update((v) => !v);
  }
}
