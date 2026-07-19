// ─── Order Types ────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface OrderCategory {
  categoryId: number;
  name: string;
  slug: string;
  parent?: {
    categoryId: number;
    name: string;
    slug: string;
  } | null;
}

export interface OrderProductImage {
  imageId: number;
  imageUrl: string;
  altText?: string | null;
  featureImage?: boolean;
}

export interface OrderProduct {
  productId: number;
  name: string;
  slug: string;
  category: OrderCategory | null;
  imageUrl: string | null;
  images?: OrderProductImage[];
}

export interface OrderVariant {
  variantId: number;
  name: string;
  sku: string;
}

export interface OrderItem {
  orderItemId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: OrderProduct;
  variant: OrderVariant | null;
}

export interface OrderSummary {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
  createdAt: string;
  items: OrderItem[];
}

// ─── Order Detail ────────────────────────────────────────────────────────────

export interface OrderShippingAddress {
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface OrderEvent {
  eventId: number;
  eventType: string;
  description: string | null;
  createdAt: string;
}

export interface OrderDetail {
  orderId: number;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  total: number;
  itemCount: number;
  totalQuantity: number;
  notes: string | null;
  focusedOrderItemId: number | null;
  createdAt: string;
  updatedAt: string;
  shippingAddress: OrderShippingAddress;
  items: OrderItem[];
  events: OrderEvent[];
}

// ─── API response shapes ──────────────────────────────────────────────────────

export interface OrderListData {
  orderCount: number;
  orders: OrderSummary[];
}
