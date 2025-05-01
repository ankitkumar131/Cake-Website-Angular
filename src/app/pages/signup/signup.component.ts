import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  loading = false;
  error = '';

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/']);
    }
  }

  handleSubmit(): void {
    this.error = '';

    // Validate form
    if (
      !this.formData.name ||
      !this.formData.email ||
      !this.formData.password ||
      !this.formData.confirmPassword
    ) {
      this.error = 'All fields are required';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    this.authService
      .signup({
        fullname: this.formData.name,
        email: this.formData.email,
        password: this.formData.password,
      })
      .subscribe({
        next: (res: any) => {
          console.log('res', res);
          this.toastService.success(
            'Account created',
            'Welcome to ThreeMuffins!'
          );

          this.authService.currentUserSubject.next(res.data.user);
          this.authService.isAuthenticated$.next(true);
          localStorage.setItem(
            'threemuffinsUser',
            JSON.stringify(res.data.user)
          );
          localStorage.setItem('token', JSON.stringify(res.data.token));

          this.router.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.log('err', err);
          if (err.status === 422) {
            const errors = err.error?.errors;
            if (errors && errors.length > 0) {
              const firstErrorObj = errors[0];
              const firstErrorMsg = Object.values(firstErrorObj)[0] as string;
              this.error = firstErrorMsg;
            } else {
              this.error = 'Validation failed, but no details provided.';
            }
          } else {
            this.error = err.error.message;
          }
        },
      });
  }
}
