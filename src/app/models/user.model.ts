export interface User {
  id: string;
  _id?: string; // For MongoDB compatibility
  name: string;
  email: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  phone?: string;
}