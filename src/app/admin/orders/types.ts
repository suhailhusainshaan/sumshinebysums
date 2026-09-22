export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export interface OrderListItem {
  orderId: number | string;
  orderDate: string;
  totalItems: number;
  totalOrderValue: number;
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  deliveryName: string;
  imageUrl?: string;
}

export interface PaginatedResponse<T> {
  data: {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
  message: string;
  status: number;
}

export interface OrderItemDetail {
  itemName: string;
  itemSku: string;
  itemCategory: string;
  itemPrice: number;
  quantity: number;
  discountApplied: number;
  lineTotal: number;
  productImageUrl?: string;
  variantImageUrl?: string;
}

export interface DeliveryDetails {
  name: string;
  address: string;
  contactNumber: string;
}

export interface OrderDetailData {
  orderId: string | number;
  orderStatus: OrderStatus;
  paymentStatus?: PaymentStatus;
  totalOrderValue: number;
  items: OrderItemDetail[];
  deliveryDetails: DeliveryDetails;
}

export interface OrderDetailResponse {
  data: OrderDetailData;
  message: string;
  status: number;
}
