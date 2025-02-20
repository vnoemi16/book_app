import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-multi-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './multi-dropdown.component.html',
  styleUrl: './multi-dropdown.component.css'
})
export class MultiDropdownComponent {
  @Output() genresChanged = new EventEmitter<any>();

  genreList = ["életrajz", "fantasy", "horror", "kalandregény", "krimi", "novella", "romantikus", "sci-fi", "történelmi"]
  dropdownOpen = false;
  selectedGenres: string[] = [];



  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onGenreChange(event: any) {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedGenres.push(value);
    } else {
      this.selectedGenres = this.selectedGenres.filter(genre => genre !== value);
    }
    this.genresChanged.emit(this.selectedGenres);
  }
}
