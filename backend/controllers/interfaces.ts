// Collection of interfaces used by the controllers
export interface PaymentInfo {
  creditCard: string;
  expiryDate: string;
  cvv: string;
}

export interface UserRequest {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentInfo: PaymentInfo;
}

export interface UserErrors {
  numErrors: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  paymentInfo: string[];
}
