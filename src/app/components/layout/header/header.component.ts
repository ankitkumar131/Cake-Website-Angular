import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header [class]="isScrolled ? 'sticky top-0 z-50 w-full transition-all duration-300 bg-white/90 backdrop-blur-md shadow-sm' : 'sticky top-0 z-50 w-full transition-all duration-300 bg-transparent'">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <a routerLink="/" class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-brand-peach">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
          <span class="text-2xl font-pacifico text-brand-darkBrown">ThreeMuffins</span>
        </a>

        <nav class="hidden md:flex space-x-6">
          <a routerLink="/" class="text-brand-darkBrown hover:text-primary font-medium transition-colors">Home</a>
          <a routerLink="/catalog" class="text-brand-darkBrown hover:text-primary font-medium transition-colors">Catalog</a>
          <a routerLink="/about" class="text-brand-darkBrown hover:text-primary font-medium transition-colors">About Us</a>
        </nav>

        <div class="flex items-center gap-4">
          @if (isAuthenticated) {
            <div class="relative group">
              <button class="flex items-center gap-2 hover:bg-primary/10 px-3 py-2 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span class="hidden sm:inline-block">{{ user?.name }}</span>
              </button>
              <div class="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md overflow-hidden z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div class="px-4 py-2 text-sm font-medium border-b">{{ user?.name }}</div>
                <a routerLink="/profile" class="block px-4 py-2 text-sm hover:bg-gray-100">Profile</a>
                <a routerLink="/orders" class="block px-4 py-2 text-sm hover:bg-gray-100">Order History</a>
                <div class="border-t"></div>
                <button (click)="logout()" class="flex items-center w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Log out
                </button>
              </div>
            </div>
          } @else {
            <a routerLink="/login" class="hover:bg-primary/10 px-3 py-2 rounded-md">Login</a>
          }

          <a routerLink="/cart" class="relative hover:bg-primary/10 px-3 py-2 rounded-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            @if (totalItems > 0) {
              <span class="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {{ totalItems }}
              </span>
            }
          </a>
        </div>
      </div>
    </header>
  `,
  styles: ``
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  isScrolled = false;
  isAuthenticated = false;
  user: User | null = null;
  totalItems = 0;

  constructor() {
    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
      this.isAuthenticated = !!user;
    });
    
    // Initial authentication state
    this.isAuthenticated = this.authService.isAuthenticated;
    this.user = this.authService.currentUser;
    
    // Update cart items count
    this.cartService.items$.subscribe(() => {
      this.totalItems = this.cartService.totalItems;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 10;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      // Authentication state will be updated by the subscription
    });
  }
}