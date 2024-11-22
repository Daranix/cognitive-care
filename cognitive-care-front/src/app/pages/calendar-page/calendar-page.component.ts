import { Component } from '@angular/core';
import { CalendarComponent } from '@schedule-x/angular';
import { createCalendar, createViewWeek } from '@schedule-x/calendar';
import '@schedule-x/theme-default/dist/index.css';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CalendarComponent],
  templateUrl: './calendar-page.component.html',
  styleUrl: './calendar-page.component.scss'
})
export class CalendarPageComponent {
  calendarApp = createCalendar({
    events: [
      {
        id: '1',
        title: 'Event 1',
        start: '2024-06-11 03:00',
        end: '2024-06-11 05:00',
      },
    ],
    views: [createViewWeek()],
  })

}
