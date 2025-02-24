import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Subscription } from 'rxjs';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  dataService = inject(DataService);
  userSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.userSubscription = this.authService.user$.subscribe(async user => {
      if (user) {
        this.dataService.getUserRole(user.uid).subscribe((role) => {
          this.authService.currentUserSig.set({
            email: user.email!,
            username: user.displayName!,
            id: user.uid,
            role: role.role
          });
        })
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

  logout() {
    this.authService.logout();
  }

}
