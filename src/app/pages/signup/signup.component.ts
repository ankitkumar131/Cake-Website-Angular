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

  handleSubmit() {
    if (!this.formData.name || !this.formData.email || !this.formData.password) {
      this.error = 'All fields are required';
      return;
    }

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;
    this.error = '';
    
    const userData = {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password
    };
    
    console.log('Submitting user data:', userData);
    
    this.authService.signup(userData).subscribe({
      next: (response) => {
        console.log('Signup success response:', response);
        this.loading = false;
        this.toastService.success('Success', 'Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Detailed signup error:', error);
        this.loading = false;
        // Try to extract more specific error message
        if (error.error && error.error.message) {
          this.error = error.error.message;
        } else if (error.status === 0) {
          this.error = 'Cannot connect to server. Please try again later.';
        } else {
          this.error = 'Signup failed. Please try again.';
        }
      }
    });
  }
}