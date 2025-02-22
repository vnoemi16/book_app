import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-multi-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './multi-dropdown.component.html',
  styleUrl: './multi-dropdown.component.css'
})
export class MultiDropdownComponent implements OnInit {
  @Output() genresChanged = new EventEmitter<any>();
  dataService = inject(DataService);

  genreList: Map<string, string> = new Map();
  dropdownOpen = false;
  selectedGenres: string[] = [];

  ngOnInit(): void {
      this.dataService.getGenres().subscribe((genres) => {
        console.log(genres);
        this.genreList = new Map(genres.map((item: { genre: any; color: any; }) => [item.genre, item.color]))
      });
  }

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
