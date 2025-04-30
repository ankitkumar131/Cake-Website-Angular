import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8 text-center">
        Contact Us
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        <!-- Contact Form -->
        <div>
          <div class="bg-white p-8 rounded-lg border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6">Send Us a Message</h2>
            
            <form (ngSubmit)="submitForm()" #contactForm="ngForm">
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label for="firstName" class="block text-sm font-medium">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      [(ngModel)]="formData.firstName"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                  <div class="space-y-2">
                    <label for="lastName" class="block text-sm font-medium">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      [(ngModel)]="formData.lastName"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
                
                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    [(ngModel)]="formData.email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                </div>
                
                <div class="space-y-2">
                  <label for="subject" class="block text-sm font-medium">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    [(ngModel)]="formData.subject"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div class="space-y-2">
                  <label for="message" class="block text-sm font-medium">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    [(ngModel)]="formData.message"
                    rows="5"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  ></textarea>
                </div>
                
                @if (formSubmitted) {
                  <div class="bg-green-100 text-green-800 p-3 rounded-md">
                    Thank you for your message! We'll get back to you soon.
                  </div>
                }
                
                <button 
                  type="submit"
                  class="w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium"
                  [disabled]="!contactForm.form.valid || formSubmitted"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Contact Information -->
        <div>
          <div class="bg-white p-8 rounded-lg border border-gray-200 mb-8">
            <h2 class="text-2xl font-semibold mb-6">Contact Information</h2>
            
            <div class="space-y-6">
              <div class="flex items-start space-x-4">
                <div class="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Our Locations</h3>
                  <p class="text-gray-600 mb-1">Main Bakery: 123 Bakery Street, Sweet City, SC 12345</p>
                  <p class="text-gray-600">Downtown Café: 456 Main Avenue, Sweet City, SC 12345</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Phone Numbers</h3>
                  <p class="text-gray-600 mb-1">Main Bakery: (123) 456-7890</p>
                  <p class="text-gray-600">Downtown Café: (123) 456-7891</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Email Addresses</h3>
                  <p class="text-gray-600 mb-1">General Inquiries: info&#64;threemuffins.com</p>
                  <p class="text-gray-600">Customer Support: support&#64;threemuffins.com</p>
                </div>
              </div>
              
              <div class="flex items-start space-x-4">
                <div class="bg-primary/10 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold mb-1">Business Hours</h3>
                  <p class="text-gray-600 mb-1">Main Bakery: Mon-Fri 7am-7pm, Sat-Sun 8am-5pm</p>
                  <p class="text-gray-600">Downtown Café: Mon-Fri 6am-6pm, Sat-Sun 7am-4pm</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-white p-8 rounded-lg border border-gray-200">
            <h2 class="text-2xl font-semibold mb-6">Follow Us</h2>
            <div class="flex space-x-4">
              <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" class="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class ContactComponent {
  formData = {
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  };
  
  formSubmitted = false;

  submitForm(): void {
    // In a real app, this would send the form data to a backend API
    console.log('Form submitted:', this.formData);
    this.formSubmitted = true;
    
    // Reset form after 5 seconds
    setTimeout(() => {
      this.formSubmitted = false;
      this.formData = {
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      };
    }, 5000);
  }
}