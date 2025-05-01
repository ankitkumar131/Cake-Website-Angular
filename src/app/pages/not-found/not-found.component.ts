import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-md mx-auto">
        <h1 class="text-9xl font-bold text-primary mb-4">404</h1>
        <h2 class="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p class="text-gray-500 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <a 
          routerLink="/"
          class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  `,
  styles: ``
})
export class NotFoundComponent {}