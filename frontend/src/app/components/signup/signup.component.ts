import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  authService = inject(AuthService);
  router = inject(Router);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });
  errorMessage: string | null = null;


  onSubmit(): void {
    const rawForm = this.form.getRawValue();
    this.authService.signUp(rawForm.email, rawForm.username, rawForm.password)
    .subscribe({
      next: () => {
      this.router.navigate(["/"]);
      },
      error: (err) => {
        this.errorMessage = err.code;
      }
    })
  }

  goHome(){
    this.router.navigate(["/"]);
  }
}
