import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiDropdownComponent } from '../multi-dropdown/multi-dropdown.component';
import { Book } from '../../book';


@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule,
            ReactiveFormsModule,
            MultiDropdownComponent
           ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {
  @Output() searchSubmitted = new EventEmitter<any>();

  

  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    title: [""],
    author: [""],
    genres: [[""]],
    dateOrder: [false],
    titleOrder: [false]
  });
  
  
  
  genresChanged(item: any) {
    this.form.controls.genres.setValue(item);
  }


  searchBooks() {
    console.log(this.form.value);
    this.searchSubmitted.emit(this.form.value);
  }

  resetSearch(){
    this.form.controls.author.setValue("");
    this.form.controls.genres.setValue([]);
    this.form.controls.title.setValue("");
    this.searchSubmitted.emit({});
  }
}


