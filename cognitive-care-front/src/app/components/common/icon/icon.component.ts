import { Component, computed, input } from '@angular/core';
import { type Icon, IconGroupInfo, iconGroups } from './icons-typings';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss'
})
export class IconComponent {

  icon = input.required<Icon>();
  iconPath = computed<string>(() => {
    const idx = this.icon().indexOf('-');
    const groupAlias = this.icon().substring(0, idx);
    const group = iconGroups[groupAlias];
    const name = this.icon().substring(idx+1);
    return `${group.folder}/${group.svgFile(name)}`;
  });

  class = input<string>()

}
