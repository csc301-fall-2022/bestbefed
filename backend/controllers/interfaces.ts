import { User } from "../entity/User"; 
import { InventoryItem } from "../entity/InventoryItem"; 
import { Order } from "../entity/Order"; 

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

export interface CleanCartInfo {
  quantity: number;
  inventoryItemId: number;
}

export interface CartItemInfo {
  cart_item_id: number;
  name: string;
  store: string;
  quantity: number;
  price: number;
  inventory_item: number;
}

export interface ItemInfo {
  itemId: number;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  order_date: Date;
  customer: string;
}

export interface OrderItemInfo {
  item_id: number;
  inventory_item: InventoryItem;
  order: Order;
}