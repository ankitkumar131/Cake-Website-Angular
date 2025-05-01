import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8 text-center">
        About ThreeMuffins
      </h1>

      <!-- Our Story -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 class="text-2xl font-semibold mb-4">Our Story</h2>
          <p class="text-gray-600 mb-4">
            ThreeMuffins began in 2010 as a small family bakery with a passion for creating delicious, 
            handcrafted treats using only the finest ingredients. What started as a weekend hobby 
            quickly grew into a beloved local business.
          </p>
          <p class="text-gray-600 mb-4">
            Our founder, Sarah Johnson, learned the art of baking from her grandmother, who believed 
            that the secret to exceptional baked goods was not just in the ingredients, but in the love 
            and care put into each creation.
          </p>
          <p class="text-gray-600">
            Today, ThreeMuffins has grown into a thriving bakery with multiple locations, but we still 
            maintain the same dedication to quality and craftsmanship that defined us from the beginning.
          </p>
        </div>
        <div class="rounded-lg overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Bakery interior" 
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Our Values -->
      <div class="bg-brand-cream/30 py-16 px-4 rounded-lg mb-16">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl font-semibold mb-8">Our Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Quality Ingredients</h3>
              <p class="text-gray-600">
                We source only the finest, freshest ingredients for our baked goods, 
                supporting local farmers and suppliers whenever possible.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Handcrafted with Love</h3>
              <p class="text-gray-600">
                Every item is made by hand with attention to detail and the care 
                that only comes from a true passion for baking.
              </p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
              <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2">Community First</h3>
              <p class="text-gray-600">
                We believe in giving back to our community through charitable 
                initiatives and supporting local events.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Our Team -->
      <div class="mb-16">
        <h2 class="text-2xl font-semibold mb-8 text-center">Meet Our Team</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="rounded-full overflow-hidden w-32 h-32 mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Sarah Johnson" 
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-lg font-semibold">Sarah Johnson</h3>
            <p class="text-gray-500">Founder & Head Baker</p>
          </div>
          <div class="text-center">
            <div class="rounded-full overflow-hidden w-32 h-32 mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Michael Rodriguez" 
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-lg font-semibold">Michael Rodriguez</h3>
            <p class="text-gray-500">Executive Pastry Chef</p>
          </div>
          <div class="text-center">
            <div class="rounded-full overflow-hidden w-32 h-32 mx-auto mb-4">
              <img 
                src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Emily Chen" 
                class="w-full h-full object-cover"
              />
            </div>
            <h3 class="text-lg font-semibold">Emily Chen</h3>
            <p class="text-gray-500">Cake Decorator</p>
          </div>
        </div>
      </div>

      <!-- Visit Us -->
      <div class="bg-brand-peach/20 py-16 px-4 rounded-lg text-center">
        <h2 class="text-2xl font-semibold mb-4">Visit Our Bakery</h2>
        <p class="text-gray-600 max-w-2xl mx-auto mb-8">
          We'd love to welcome you to our bakery. Stop by to enjoy our fresh treats 
          and the warm, inviting atmosphere that makes ThreeMuffins special.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-2">Main Location</h3>
            <p class="text-gray-600 mb-2">123 Bakery Street, Sweet City, SC 12345</p>
            <p class="text-gray-600 mb-2">Phone: (123) 456-7890</p>
            <p class="text-gray-600">
              Hours: Mon-Fri 7am-7pm, Sat-Sun 8am-5pm
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold mb-2">Downtown Café</h3>
            <p class="text-gray-600 mb-2">456 Main Avenue, Sweet City, SC 12345</p>
            <p class="text-gray-600 mb-2">Phone: (123) 456-7891</p>
            <p class="text-gray-600">
              Hours: Mon-Fri 6am-6pm, Sat-Sun 7am-4pm
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class AboutComponent {}