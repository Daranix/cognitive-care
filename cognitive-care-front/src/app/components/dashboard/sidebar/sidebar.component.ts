import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { IconComponent } from '../../common/icon/icon.component';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    IconComponent,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {


  showMenu = input.required<boolean>();


}
