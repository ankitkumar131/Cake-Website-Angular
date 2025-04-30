import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ProductGridComponent } from '../../components/products/product-grid/product-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductGridComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative h-[90vh] flex items-center justify-center bg-gradient-to-r from-brand-cream to-brand-peach/20">
        <div
          class="absolute inset-0 bg-cover bg-center z-0 opacity-20"
          style="background-image: url('https://images.unsplash.com/photo-1612198790700-0ff08cb726e5?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');"
        ></div>
        <div class="container mx-auto px-4 z-10 animate-fade-in">
          <div class="max-w-2xl">
            <h1 class="text-5xl sm:text-6xl font-pacifico text-brand-darkBrown mb-6">
              Delicious treats baked with love
            </h1>
            <p class="text-lg sm:text-xl mb-8">
              Experience the joy of handcrafted cakes, muffins, and pastries made with
              the finest ingredients.
            </p>
            <div class="space-x-4">
              <a
                routerLink="/catalog"
                class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md inline-block font-medium"
              >
                Shop Now
              </a>
              <a
                routerLink="/about"
                class="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md inline-block font-medium"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-pacifico text-brand-darkBrown mb-4">
              Featured Treats
            </h2>
            <p class="text-gray-500 max-w-2xl mx-auto">
              Discover our most loved treats and seasonal specials that will
              satisfy your sweet cravings.
            </p>
          </div>

          <app-product-grid [products]="featuredProducts"></app-product-grid>

          <div class="text-center mt-12">
            <a
              routerLink="/catalog"
              class="border border-gray-300 hover:border-gray-400 px-6 py-3 rounded-md inline-block font-medium"
            >
              View All Products
            </a>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="py-16 bg-brand-cream/50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-pacifico text-brand-darkBrown mb-4">
              Explore Categories
            </h2>
            <p class="text-gray-500 max-w-2xl mx-auto">
              Browse through our delightful selection of baked goods.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            @for (category of categories; track category.name) {
              <a
                [routerLink]="['/catalog']"
                [queryParams]="{ category: category.category }"
                class="relative overflow-hidden rounded-lg aspect-square group"
              >
                <img
                  [src]="category.image"
                  [alt]="category.name"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <h3 class="text-white text-xl font-bold">{{ category.name }}</h3>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-pacifico text-brand-darkBrown mb-4">
              What Our Customers Say
            </h2>
            <p class="text-gray-500 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our happy customers have
              to say about ThreeMuffins.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (testimonial of testimonials; track testimonial.name) {
              <div
                class="bg-brand-cream p-6 rounded-lg shadow-sm border border-brand-peach/20"
              >
                <div class="flex items-center space-x-1 mb-4">
                  @for (star of [1, 2, 3, 4, 5]; track star) {
                    <svg
                      class="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  }
                </div>
                <p class="text-brand-brown mb-4">{{ testimonial.text }}</p>
                <p class="font-medium">{{ testimonial.name }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Newsletter -->
      <section class="py-16 bg-brand-pink/20">
        <div class="container mx-auto px-4">
          <div class="max-w-xl mx-auto text-center">
            <h2 class="text-3xl font-pacifico text-brand-darkBrown mb-4">
              Join Our Newsletter
            </h2>
            <p class="text-gray-500 mb-6">
              Subscribe to get special offers, free giveaways, and new product
              announcements.
            </p>
            <form class="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                class="flex-1 px-4 py-3 rounded-md border border-gray-300"
                required
              />
              <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: ``
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  
  featuredProducts: Product[] = [];
  
  categories = [
    {
      name: "Cakes",
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2hvY29sYXRlJTIwY2FrZXxlbnwwfHwwfHx8MA%3D%3D",
      category: "cakes",
    },
    {
      name: "Muffins",
      image: "https://images.unsplash.com/photo-1607958996333-41784c70c366?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "muffins",
    },
    {
      name: "Pastries",
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "pastries",
    },
    {
      name: "Cupcakes",
      image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      category: "cupcakes",
    },
  ];
  
  testimonials = [
    {
      name: "Sarah Johnson",
      text: "The cakes from ThreeMuffins are absolutely divine! I ordered a birthday cake and everyone was impressed by both the taste and presentation.",
    },
    {
      name: "Mike Thompson",
      text: "Best muffins in town! I stop by every morning for a blueberry muffin and coffee. The staff is always friendly and the pastries are always fresh.",
    },
    {
      name: "Emily Davis",
      text: "Their red velvet cupcakes are to die for! Perfect texture and the cream cheese frosting is just right. Will definitely be ordering again.",
    },
  ];

  ngOnInit(): void {
    this.productService.getFeaturedProducts().subscribe(products => {
      this.featuredProducts = products;
    });
  }
}