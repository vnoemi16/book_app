import { Component, inject, OnInit, signal } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputBookComponent } from '../input-book/input-book.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MultiDropdownComponent } from '../multi-dropdown/multi-dropdown.component';
import { CalendarComponent } from '../calendar/calendar.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, InputBookComponent, ReactiveFormsModule, MultiDropdownComponent, CalendarComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit {
  authService = inject(AuthService);
  dataService = inject(DataService);
  books = signal<Book[]>([]);
  genreList: Map<string, string> = new Map();

  addingBook = false;
  page = 1;
  maxpage = 1;

  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    title: [""],
    author: [""],
    genres: [[""]],
    order: ["neither"],
    o: [false]
  });


  constructor(private router: Router) { }

  ngOnInit(): void {
    this.dataService.getBooks({page: 1, limit: 20}).subscribe((res) => {
      this.books.set(res.books);
      this.maxpage = res.pages;
    });
    this.dataService.getGenres().subscribe((genres) => {
      this.genreList = new Map(genres.map((item: { genre: any; color: any; }) => [item.genre, item.color]))
    });
  }

  getPage(i: number) {
    if ((i>0 && this.page < this.maxpage) || (i<0 && this.page > 1)){
      this.page += i;
      this.dataService.getBooks({...this.form.getRawValue(), page: this.page, limit: 20})
      .subscribe((res) => {
        this.books.set(res.books);
        this.maxpage = res.pages;
      })
    }
    
  }

  openBook(id: string) {
    this.router.navigate(['/book/' + id]);
  }

  submitBook(e: any) {
    this.dataService.addBook(e).subscribe(_result => this.dataService.getBooks({}));
    this.addingBook = false;
  }

  genresChanged(item: any) {
    this.form.controls.genres.setValue(item);
  }

  searchBooks() {
    this.dataService.getBooks({...this.form.getRawValue(), page: this.page, limit: 20}).subscribe((res) => {
      this.books.set(res.books);
      this.maxpage = res.pages;
    });
  }

  resetSearch() {
    this.form.controls.author.setValue("");
    this.form.controls.genres.setValue([]);
    this.form.controls.title.setValue("");
    this.form.controls.order.setValue("neither");
    this.dataService.getBooks({page: this.page, limit: 20}).subscribe(data => this.books.set(data));
  }
}