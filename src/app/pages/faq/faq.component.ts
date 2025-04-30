import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
  category: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8 text-center">
        Frequently Asked Questions
      </h1>

      <div class="max-w-3xl mx-auto">
        <div class="mb-8">
          <div class="flex justify-center space-x-4 mb-8">
            <button 
              (click)="filterCategory('all')"
              class="px-4 py-2 rounded-md text-sm font-medium"
              [ngClass]="selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
            >
              All
            </button>
            @for (category of categories; track category) {
              <button 
                (click)="filterCategory(category)"
                class="px-4 py-2 rounded-md text-sm font-medium"
                [ngClass]="selectedCategory === category ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'"
              >
                {{ category }}
              </button>
            }
          </div>
          
          <div class="space-y-4">
            @for (faq of filteredFaqs; track faq.question) {
              <div class="border rounded-lg overflow-hidden">
                <button 
                  (click)="toggleFaq(faq)"
                  class="flex justify-between items-center w-full p-4 text-left font-medium focus:outline-none"
                  [ngClass]="faq.isOpen ? 'bg-gray-50' : 'bg-white'"
                >
                  <span>{{ faq.question }}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round"
                    [ngClass]="faq.isOpen ? 'transform rotate-180' : ''"
                    class="transition-transform duration-200"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                @if (faq.isOpen) {
                  <div class="p-4 bg-gray-50 border-t">
                    <p class="text-gray-600">{{ faq.answer }}</p>
                  </div>
                }
              </div>
            }
          </div>
        </div>
        
        <div class="bg-brand-cream/30 p-6 rounded-lg text-center">
          <h2 class="text-xl font-semibold mb-2">Still have questions?</h2>
          <p class="text-gray-600 mb-4">
            If you couldn't find the answer to your question, please feel free to contact us.
          </p>
          <a 
            routerLink="/contact"
            class="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-md inline-block font-medium"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class FaqComponent {
  selectedCategory = 'all';
  categories = ['Orders', 'Products', 'Shipping', 'Returns'];
  
  faqs: FaqItem[] = [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our catalog, selecting the items you want, adding them to your cart, and proceeding to checkout. You will need to create an account or log in to complete your purchase.',
      isOpen: false,
      category: 'Orders'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover) and PayPal. All transactions are secure and encrypted.',
      isOpen: false,
      category: 'Orders'
    },
    {
      question: 'How can I track my order?',
      answer: 'Once your order has been shipped, you will receive a confirmation email with tracking information. You can also view your order status by logging into your account and visiting the "Order History" section.',
      isOpen: false,
      category: 'Orders'
    },
    {
      question: 'Are your products made fresh?',
      answer: 'Yes, all our products are baked fresh daily. We use only the highest quality ingredients and never use preservatives or artificial flavors.',
      isOpen: false,
      category: 'Products'
    },
    {
      question: 'Do you offer gluten-free or vegan options?',
      answer: 'Yes, we offer a selection of gluten-free and vegan products. These items are clearly labeled in our catalog. Please note that while we take precautions, our kitchen does process products containing gluten and animal products.',
      isOpen: false,
      category: 'Products'
    },
    {
      question: 'How long do your products stay fresh?',
      answer: 'Our products are best enjoyed within 2-3 days of purchase. We recommend storing them in an airtight container at room temperature or in the refrigerator for slightly longer shelf life.',
      isOpen: false,
      category: 'Products'
    },
    {
      question: 'What are your shipping rates?',
      answer: 'We offer free shipping on orders over $50. For orders under $50, shipping costs are calculated based on your location and the weight of your order. The exact shipping cost will be displayed at checkout before you complete your purchase.',
      isOpen: false,
      category: 'Shipping'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 2-5 business days, depending on your location. We also offer expedited shipping options at checkout for an additional fee.',
      isOpen: false,
      category: 'Shipping'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Currently, we only ship within the United States. We hope to expand our shipping options to international customers in the future.',
      isOpen: false,
      category: 'Shipping'
    },
    {
      question: 'What is your return policy?',
      answer: 'Due to the perishable nature of our products, we cannot accept returns. However, if you receive a damaged product or are unsatisfied with your order for any reason, please contact our customer service team within 24 hours of delivery, and we will work to make it right.',
      isOpen: false,
      category: 'Returns'
    },
    {
      question: 'Can I cancel my order?',
      answer: 'Orders can be canceled within 1 hour of placement. After that time, your order may have already entered the preparation process and cannot be canceled. Please contact our customer service team as soon as possible if you need to cancel an order.',
      isOpen: false,
      category: 'Returns'
    },
    {
      question: 'What if my order arrives damaged?',
      answer: 'If your order arrives damaged, please take a photo of the damaged items and contact our customer service team within 24 hours of delivery. We will either issue a refund or arrange for replacement products to be sent to you.',
      isOpen: false,
      category: 'Returns'
    }
  ];
  
  get filteredFaqs(): FaqItem[] {
    if (this.selectedCategory === 'all') {
      return this.faqs;
    }
    return this.faqs.filter(faq => faq.category === this.selectedCategory);
  }

  filterCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggleFaq(faq: FaqItem): void {
    faq.isOpen = !faq.isOpen;
  }
}