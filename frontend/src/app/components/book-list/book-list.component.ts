import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InputBookComponent } from '../input-book/input-book.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MultiDropdownComponent } from '../multi-dropdown/multi-dropdown.component';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, InputBookComponent, ReactiveFormsModule, MultiDropdownComponent],
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
    this.dataService.getBooks({}).subscribe({
      next: (data) => { this.books.set(data) },
      error: (error) => { console.log(error) }
    });
    this.dataService.getGenres().subscribe((genres) => {
      this.genreList = new Map(genres.map((item: { genre: any; color: any; }) => [item.genre, item.color]))
    });
  }

  getPage(i: number) {
    if ((i>0 && this.page < this.maxpage) || (i<0 && this.page > 1)){
      this.page += i;
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
    this.dataService.getBooks(this.form.getRawValue()).subscribe(data => this.books.set(data));
  }

  resetSearch() {
    this.form.controls.author.setValue("");
    this.form.controls.genres.setValue([]);
    this.form.controls.title.setValue("");
    this.form.controls.order.setValue("neither");
    this.dataService.getBooks({}).subscribe(data => this.books.set(data));
  }
}