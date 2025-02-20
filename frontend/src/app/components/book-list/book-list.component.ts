import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { BookService } from '../../services/book.service';
import { Book } from '../../book';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../search-form/search-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, SearchFormComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.css'
})
export class BookListComponent implements OnInit{
  bookService = inject(BookService);
  books = signal<Book[]>([]);

  constructor(private router: Router){
    this.bookService.getBooks({}).subscribe({
      next: (data) => {this.books.set(data)},
      error: (error) => {console.log(error)}
    });
  }

  getData(params: any){
    this.bookService.getBooks(params).subscribe(data => this.books.set(data));
  }

  ngOnInit(): void {
      
  }

  handleSearch(e: any){
    console.log(e);
    this.bookService.getBooks(e).subscribe(data => this.books.set(data));
  }

  openBook(id: string){
    this.router.navigate(['/book/' + id]);
  }
}
