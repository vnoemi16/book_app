import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ReviewsComponent } from '../reviews/reviews.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { InputBookComponent } from '../input-book/input-book.component';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [ReviewsComponent, ReactiveFormsModule, CommonModule, InputBookComponent],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  activatedRoute = inject(ActivatedRoute);
  dataService = inject(DataService);
  authService = inject(AuthService);

  id!: string;
  selectedBook: any;

  isFavorite = false;

  updateButton = "Adatok módosítása";
  updating = false;


  constructor(private router: Router) { }


  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.params["id"];
    this.dataService.getBookById(this.id).subscribe(data => {
      this.selectedBook = data;
    });
    this.authService.user$.subscribe((user) => {
      if (user){
        this.dataService.isFavorite({user_id: user.uid, book_id: this.selectedBook._id}).subscribe((res) => {
          if (res.found === true){
            this.isFavorite = true;
          }
          else{
            this.isFavorite = false;
          }
        });
      }
    });  
  }

  deleteBook() {
    this.dataService.deleteBook(this.id).subscribe((deleted) => console.log("Book was deleted."));
    this.router.navigate(["/"]);
  }

  openUpdate() {
      this.updating = true;
      console.log(this.updating);
  }


  updateSubmitted(e: any){
    this.dataService.updateBook(this.id, e).subscribe((updated) => {
      this.dataService.getBookById(this.id).subscribe(data => this.selectedBook = data);
    })
    this.updating = false;
    this.updateButton = "Adatok módosítása";
  }

  toFavorites(){
    const id = this.authService.currentUserSig()?.id;
    {
      if(id){
        this.dataService.isFavorite({user_id: id, book_id: this.selectedBook._id}).subscribe((res) => {
          if (res.found === true){
            this.dataService.removeFavorite({user_id: id, book_id: this.selectedBook._id})
            .subscribe((res) => {this.isFavorite = false});
          }
          if(res.found === false){
            this.dataService.addFavorite({user_id: id, book_id: this.selectedBook._id})
            .subscribe((res) => {this.isFavorite = true});
          }
        })
      }
    }
    
  }


}

