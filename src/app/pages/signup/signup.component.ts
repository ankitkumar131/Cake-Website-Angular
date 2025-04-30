import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,

  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (!this.formData.name || !this.formData.email || !this.formData.password || !this.formData.confirmPassword) {
      this.error = 'All fields are required';
      return;
    }
    
    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    
    this.loading = true;
    
    this.authService.signup(this.formData.name, this.formData.email, this.formData.password)
      .subscribe({
        next: () => {
          this.toastService.success('Account created', 'Welcome to ThreeMuffins!');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err.message || 'Failed to create account. Please try again.';
          this.loading = false;
        }
      });
  }
}