import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: `./login.component.html`,
  styles: ``,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  formData = {
    email: '',
    password: '',
  };

  loading = false;
  error = '';
  returnUrl = '/';

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.route.queryParams.subscribe((params) => {
      this.returnUrl = params['returnUrl'] || '/';
    });

    // Redirect if already logged in
    if (this.authService.isAuthenticated) {
      this.router.navigate([this.returnUrl]);
    }
  }

  handleSubmit(): void {
    this.error = '';
    this.loading = true;

    this.authService
      .login({ email: this.formData.email, password: this.formData.password })
      .subscribe({
        next: (res: any) => {
          console.log('resss', res);
          this.toastService.success(
            'Welcome back!',
            `Good to see you again, ${this.authService.currentUser?.name}!`
          );
          this.authService.currentUserSubject.next(res.data.user);
          this.authService.isAuthenticated$.next(true);
          localStorage.setItem(
            'threemuffinsUser',
            JSON.stringify(res.data.user)
          );
          localStorage.setItem('token', JSON.stringify(res.data.token));

          this.router.navigate([this.returnUrl]);
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
