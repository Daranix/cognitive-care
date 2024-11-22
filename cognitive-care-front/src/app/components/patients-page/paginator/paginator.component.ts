import { Component, computed, input, output } from '@angular/core';
import { ButtonComponent } from '../../common/button/button.component';
import { IconComponent } from '../../common/icon/icon.component';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [ButtonComponent, IconComponent],
  templateUrl: './paginator.component.html',
  styleUrl: './paginator.component.scss'
})
export class PaginatorComponent {

  readonly limit = input.required<number>();
  readonly page = input.required<number>();
  readonly total = input.required<number>();
  readonly offset = computed(() =>  ((this.limit() * this.page()) - this.limit() + 1));
  readonly pageChanged = output<{ page: number }>();

  changePage(opt: 'previous' | 'next') {
    const increment = opt === 'previous' ? -1 : 1;
    this.pageChanged.emit({ page: this.page() + (increment) });
  }

}
