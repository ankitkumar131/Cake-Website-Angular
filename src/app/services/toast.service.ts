import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  constructor() { }

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 3000
    };

    this.toastsSubject.next([...this.toastsSubject.value, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      this.remove(id);
    }, newToast.duration);
  }

  success(title: string, description?: string, duration?: number): void {
    this.show({
      title,
      description,
      type: 'success',
      duration
    });
  }

  error(title: string, description?: string, duration?: number): void {
    this.show({
      title,
      description,
      type: 'error',
      duration
    });
  }

  info(title: string, description?: string, duration?: number): void {
    this.show({
      title,
      description,
      type: 'info',
      duration
    });
  }

  warning(title: string, description?: string, duration?: number): void {
    this.show({
      title,
      description,
      type: 'warning',
      duration
    });
  }

  remove(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter(toast => toast.id !== id));
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}