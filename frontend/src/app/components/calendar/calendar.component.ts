import { ChangeDetectionStrategy, Component,  Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addMonths, addYears, eachDayOfInterval, endOfMonth, format, formatDistance, formatRelative, getDay, startOfMonth, subDays, subMonths, subYears } from 'date-fns';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent {
  @Input() books = [];

  days: any[] = [];
  currentDate = new Date();
  viewMode: 'month' | 'year' = 'month';

  monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
  ];


  get daysInMonth() {
    const start = startOfMonth(this.currentDate);
    const end = endOfMonth(this.currentDate);
    return [...Array((getDay(start) + 6) % 7).fill(null), ...eachDayOfInterval({ start, end })
      .map(day => ({
        date: day,                     
        formatted: format(day, 'dd'),   
      }))];
  }

  get monthsInYear() {
    return Array.from({ length: 12 }, (_, i) => new Date(this.currentDate.getFullYear(), i, 1));
  }


  changeMonth(i: number) {
    this.currentDate = this.viewMode === 'month' ? addMonths(this.currentDate, i) : addYears(this.currentDate, i);
  }

  prevPage(){
    this.currentDate = this.viewMode === 'month' ? subMonths(this.currentDate, 1) : subYears(this.currentDate, 1);
  }

  nextPage(){
    this.currentDate = this.viewMode === 'month' ? addMonths(this.currentDate, 1) : addYears(this.currentDate, 1);
  }

  switchView(mode: 'month' | 'year') {
    this.viewMode = mode;
  }

}
