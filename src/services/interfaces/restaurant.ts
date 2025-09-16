export interface Reservation {
  id: string;
  date: string; // ISO date format (YYYY-MM-DD)
  time: string; // HH:MM format
  guests: number;
  occasion: string;
  name: string;
  email: string;
  phone: string;
  specialRequests?: string; // Optional field
  toEmail: string;
  storeId: string;
  createdAt: string; // ISO timestamp
}
