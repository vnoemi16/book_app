import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiDropdownComponent } from '../multi-dropdown/multi-dropdown.component';

@Component({
  selector: 'app-input-book',
  standalone: true,
  imports: [ReactiveFormsModule, MultiDropdownComponent],
  templateUrl: './input-book.component.html',
  styleUrl: './input-book.component.css'
})
export class InputBookComponent {
  @Input() isOpened : boolean | undefined;
  @Output() bookSubmitted = new EventEmitter<any>();
  active = false;

  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    title: ['', Validators.required],
    authors: ['', Validators.required],
    description: ['', Validators.required],
    genres: [[''], Validators.required],
    published: [new Date(), Validators.required]
  });

  genresChanged(item: any) {
    this.form.controls.genres.setValue(item);
  }

  onSubmit(){
    this.bookSubmitted.emit(this.form.getRawValue());
  }
}
