import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-3xl font-pacifico text-brand-darkBrown mb-8 text-center">
        Terms & Conditions
      </h1>

      <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg border border-gray-200">
        <div class="prose prose-sm max-w-none">
          <p class="text-gray-500 mb-6">
            Last Updated: April 30, 2025
          </p>
          
          <p class="mb-4">
            Welcome to ThreeMuffins. These Terms & Conditions govern your use of our website and services.
            By accessing or using our website, you agree to be bound by these Terms. If you do not agree with
            any part of these Terms, you may not use our website.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">1. Use of Our Website</h2>
          <p class="mb-4">
            You may use our website only for lawful purposes and in accordance with these Terms. You agree not to:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Use our website in any way that violates applicable laws or regulations.</li>
            <li>Use our website to transmit or send unsolicited commercial communications.</li>
            <li>Attempt to gain unauthorized access to any portion of our website.</li>
            <li>Use our website to collect or harvest personal information about other users.</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of our website.</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">2. Account Registration</h2>
          <p class="mb-4">
            To access certain features of our website, you may need to create an account. When you create an account, you agree to:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate, current, and complete information.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Keep your password confidential and notify us immediately of any unauthorized access to your account.</li>
            <li>Be responsible for all activities that occur under your account.</li>
          </ul>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">3. Orders and Payments</h2>
          <p class="mb-4">
            When you place an order through our website, you agree to:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Provide accurate payment information.</li>
            <li>Pay all charges incurred by you or any users of your account at the prices in effect when such charges are incurred.</li>
            <li>Pay any applicable taxes related to your purchases.</li>
          </ul>
          <p class="mb-4">
            We reserve the right to refuse or cancel any orders at our sole discretion. If we cancel an order after you have already been charged, we will issue a refund.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">4. Product Information</h2>
          <p class="mb-4">
            We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, images, or other content on our website are accurate, complete, reliable, current, or error-free.
          </p>
          <p class="mb-4">
            If a product offered by us is not as described, your sole remedy is to return it in unused condition.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">5. Shipping and Delivery</h2>
          <p class="mb-4">
            We will make reasonable efforts to deliver products within the estimated delivery time. However, we are not responsible for delays beyond our control.
          </p>
          <p class="mb-4">
            Risk of loss and title for items purchased from our website pass to you upon delivery of the items to the carrier.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">6. Returns and Refunds</h2>
          <p class="mb-4">
            Due to the perishable nature of our products, we generally do not accept returns. However, if you receive a damaged product or are unsatisfied with your order, please contact our customer service team within 24 hours of delivery.
          </p>
          <p class="mb-4">
            Refunds, if issued, will be processed to the original method of payment.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">7. Intellectual Property</h2>
          <p class="mb-4">
            Our website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by ThreeMuffins, its licensors, or other providers of such material and are protected by copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p class="mb-4">
            In no event will ThreeMuffins, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind arising from the use of our website, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p class="mb-4">
            We may revise and update these Terms from time to time at our sole discretion. All changes are effective immediately when we post them.
          </p>
          <p class="mb-4">
            Your continued use of our website following the posting of revised Terms means that you accept and agree to the changes.
          </p>
          
          <h2 class="text-xl font-semibold mt-8 mb-4">10. Contact Information</h2>
          <p class="mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <p class="mb-4">
            ThreeMuffins<br>
            123 Bakery Street<br>
            Sweet City, SC 12345<br>
            Email: legalthreemuffins.com<br>
            Phone: (123) 456-7890
          </p>
        </div>
      </div>
    </div>
  `,
  styles: ``
})
export class TermsComponent {}