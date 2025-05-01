import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {
  private router = inject(Router);
  private location = inject(Location);
  
  order: Order | null = null;

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'] as Order;
    }
    
    // If no order is found, redirect to home
    if (!this.order) {
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }

  trackByProductId(index: number, item: any) {
    return item.product.id;
  }
}