import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  @Input() book_id!: string;
  rating = 0;
  authService = inject(AuthService);
  dataService = inject(DataService);
  averageRating = 0;
  reviews = signal<any[]>([]);


  fb = inject(FormBuilder);
  form = this.fb.nonNullable.group({
    review: ['']
  });

  ngOnInit(): void {
    this.dataService.getBookAverageRating(this.book_id).subscribe((average) => this.averageRating = average.averageRating);
    this.dataService.getBookReviews(this.book_id).subscribe((reviews) => this.reviews.set(reviews))
  }

  rate(rating: number){
    this.rating = rating;
    console.log(this.rating);
  }

  onSubmit() {
    console.log(this.authService.currentUserSig());
    const id = this.authService.currentUserSig()?.id;
    const username = this.authService.currentUserSig()?.username;
    if (id != null && username != null){
      const body = {
        user_id: id,
        username: username,
        book_id: this.book_id,
        stars: this.rating,
        review: this.form.getRawValue().review
      }
      this.dataService.addReview(body).subscribe((_result) => {
        this.form.controls.review.setValue('');
        this.rating = 0;
        this.dataService.getBookAverageRating(this.book_id).subscribe((average) => this.averageRating = average.averageRating);
        this.dataService.getBookReviews(this.book_id).subscribe((reviews) => this.reviews.set(reviews))
      });
    }
    
  }
}
