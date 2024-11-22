import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  loading = input<boolean>(false);
  type = input<'button' | 'submit'>('button');

}
