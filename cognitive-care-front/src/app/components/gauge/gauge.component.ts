import { NgClass } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-gauge',
  standalone: true,
  imports: [NgClass],
  templateUrl: './gauge.component.html',
  styleUrl: './gauge.component.scss'
})
export class GaugeComponent {

  readonly percent = input.required<number>();
  readonly realPercent = computed(() => (this.percent() * 50) / 100)
  readonly title = input<string>();
  readonly subtitle = input<string>();

  readonly calculatedStyle = computed(() => ({
    [this.styles.ok]: (this.percent() < 45),
    [this.styles.middle]: (this.percent() >= 45 && this.percent() < 65),
    [this.styles.bad]: (this.percent() >= 65) 
  }))

  readonly styles = {
    ok: 'text-green-600 dark:text-green-500',
    middle: 'text-orange-600 dark:orange-blue-500',
    bad: 'text-red-600 dark:text-red-500'
  }

}
