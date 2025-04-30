import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: `./login.component.html`,
  styles: ``
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  
  formData = {
    email: '',
    password: ''
  };
  
  loading = false;
  error = '';
  returnUrl = '/';

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.route.queryParams.subscribe(params => {
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
    
    this.authService.login(this.formData.email, this.formData.password)
      .subscribe({
        next: () => {
          this.toastService.success('Welcome back!', `Good to see you again, ${this.authService.currentUser?.name}!`);
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          this.error = 'Invalid email or password. Please try again.';
          this.loading = false;
        }
      });
  }
}