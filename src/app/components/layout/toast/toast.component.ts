import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../services/toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full">
      @for (toast of toasts; track toast.id) {
        <div 
          [@fadeInOut]
          class="bg-white rounded-lg shadow-xl overflow-hidden flex border-l-4 transform transition-all duration-300 hover:shadow-2xl"
          [ngClass]="{
            'border-green-500': toast.type === 'success',
            'border-red-500': toast.type === 'error',
            'border-blue-500': toast.type === 'info',
            'border-amber-500': toast.type === 'warning'
          }"
        >
          <div class="p-4 flex-1">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                @if (toast.type === 'success') {
                  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                  </div>
                } @else if (toast.type === 'error') {
                  <div class="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>  
                } @else if (toast.type === 'info') {
                  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                    </svg>
                  </div>
                } @else if (toast.type === 'warning') {
                  <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg class="h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                  </div>
                }
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">{{ toast.title }}</p>
                @if (toast.description) {
                  <p class="mt-1 text-sm text-gray-600">{{ toast.description }}</p>
                }
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button 
                  (click)="removeToast(toast.id)"
                  class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                >
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      --toast-success-color: #10b981;
      --toast-error-color: #ef4444;
      --toast-info-color: #3b82f6;
      --toast-warning-color: #f59e0b;
    }
  `,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%) translateY(10px)' }),
        animate('350ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateX(0) translateY(0)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 0, transform: 'translateX(100%) translateY(10px)' }))
      ])
    ])
  ]
})
export class ToastComponent {
  private toastService = inject(ToastService);
  toasts: Toast[] = [];

  constructor() {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  removeToast(id: string): void {
    this.toastService.remove(id);
  }
}