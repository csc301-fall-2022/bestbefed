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

export interface StoreRequest {
  storeName: string;
  password: string;
  address: string;
  email: string;
}

export interface StoreInfo {
  storeName: string;
  distance: number;
  address: string;
}

export interface StoreErrors {
  numErrors: number;
  storeName: string;
  password: string;
  address: string;
  email: string;
}

export interface ItemInfo {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
}
