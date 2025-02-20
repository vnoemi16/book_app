import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiDropdownComponent } from '../multi-dropdown/multi-dropdown.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReviewsComponent, MultiDropdownComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  bookService = inject(BookService);

  id!: string;
  selectedBook: any;

  updateButton = "Adatok módosítása";
  updating = false;

  fb = inject(FormBuilder);
  form!: FormGroup;

  constructor(private router: Router) { }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.bookService.getBookById(this.id).subscribe(data => {
      console.log(data);
      this.selectedBook = data;
      this.form = this.fb.nonNullable.group({
        title: [this.selectedBook.title, Validators.required],
        authors: [this.selectedBook.authors.join(", "), Validators.required],
        description: [this.selectedBook.description, Validators.required],
        genres: [this.selectedBook.genres, Validators.required],
        published: [this.selectedBook.published.toISOString().split('T')[0], Validators.required]
      });
    });
    
  }

  deleteBook() {
    this.bookService.deleteBook(this.id);
    this.router.navigate(["/"]);
  }

  openUpdate() {
    if (!this.updating){
      this.updateButton = "Mégsem";
      this.updating = true;
    }
    else{
      this.updating = false;
      this.updateButton = "Adatok módosítása";
    }
    
  }

  genresChanged(item: any) {
    this.form.controls['genres'].setValue(item);
  }

  onSubmit(){
    const rawForm = this.form.getRawValue();
    this.bookService.updateBook(this.id, rawForm);
    this.bookService.getBookById(this.id).subscribe(data => this.selectedBook = data);
    this.updating = false;
    this.updateButton = "Adatok módosítása";
    this.form = this.fb.nonNullable.group({
      title: [this.selectedBook.title, Validators.required],
      authors: [this.selectedBook.authors.join(", "), Validators.required],
      description: [this.selectedBook.description, Validators.required],
      genres: [this.selectedBook.genres, Validators.required],
      published: [this.selectedBook.published, Validators.required]
    });
  }


}

