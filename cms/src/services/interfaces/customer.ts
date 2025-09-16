export interface Customer {
  id: string;
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  registrationDate: string;
  status: "active" | "inactive";
  lastPurchaseDate: string | null;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    phone: boolean;
  };
  notes: string;
}

export interface CustomerFormData extends Omit<Customer, "id" | "registrationDate" | "lastPurchaseDate"> {}
