import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { BookListComponent } from './components/book-list/book-list.component';
import { HttpClient } from '@angular/common/http';
import { AuthService, Role } from './services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  userSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(async user => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
          id: user.uid,
          role: Role.USER
        });
      }
      else {
        this.authService.currentUserSig.set(null);
      }
    }
    );
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
