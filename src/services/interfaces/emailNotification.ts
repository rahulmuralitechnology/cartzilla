export interface EmailNotificationProps {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  toEmail: string;
  storeId: string;
  createdAt: string;
}
