import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  authService = inject(AuthService);
  dataService = inject(DataService);

  favorites: any[] = [];

  constructor(public router: Router){};

  ngOnInit(): void {
      this.authService.user$.subscribe((user) => {
        if (user == null){
          this.router.navigate(["/books"]);
        }
        else{
          this.dataService.getFavorites(user.uid).subscribe((data) => {this.favorites = data});
        }
      });
  }
}
