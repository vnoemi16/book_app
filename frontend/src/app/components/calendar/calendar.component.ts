import { ChangeDetectionStrategy, ChangeDetectorRef, Component, computed, EventEmitter, inject, Input, OnInit, Output, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { addMonths, addYears, eachDayOfInterval, endOfMonth, format, formatDistance, formatRelative, getDay, startOfMonth, subDays, subMonths, subYears } from 'date-fns';
import { DataService } from '../../services/data.service';
import { Book } from '../../book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
  days: any[] = [];
  currentDate = new Date();
  booksByDate: { [key: number]: Book[] } = {};
  viewMode: 'month' | 'year' = 'month';

  dataService = inject(DataService);

  monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
  ];
  changeDetectorRef = inject(ChangeDetectorRef);

  constructor(public router: Router){}

  getBooks() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    this.dataService.getBooks({year: year, month: month, page: 1, limit: 0})
    .subscribe((res) => {
      this.booksByDate = {};
      res.books.forEach((book: Book) => {
        const day = new Date(book.published).getDate();
        if (!this.booksByDate[day]) {
            this.booksByDate[day] = [];
        }
        this.booksByDate[day].push(book);
    });
    this.changeDetectorRef.detectChanges();
    });

  }

  ngOnInit(): void {
    this.getBooks();
  }

  get daysInMonth() {
    const start = startOfMonth(this.currentDate);
    const end = endOfMonth(this.currentDate);
    return [...Array((getDay(start) + 6) % 7).fill(null), ...eachDayOfInterval({ start, end })
      .map(day => ({
        date: day,
        formatted: format(day, 'dd'),
        num: day.getDate()
      }))];
  }


  prevPage() {
    this.currentDate = this.viewMode === 'month' ? subMonths(this.currentDate, 1) : subYears(this.currentDate, 1);
    this.getBooks();
  }

  nextPage() {
    this.currentDate = this.viewMode === 'month' ? addMonths(this.currentDate, 1) : addYears(this.currentDate, 1);
    this.getBooks();
  }

  switchView(mode: 'month' | 'year') {
    this.viewMode = mode;
  }

}
