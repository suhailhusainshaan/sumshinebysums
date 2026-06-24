export interface ApiEnvelope<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface StateOption {
  id: number;
  name: string;
  code: string;
}

export interface CityOption {
  id: number;
  name: string;
  stateId: number;
}

export interface PincodeLocation {
  pincode: string;
  stateId: number;
  stateName: string;
  stateCode: string;
  cityId: number;
  cityName: string;
}

export interface Address {
  id: number;
  label: string | null;
  fullName: string;
  phone: string;
  line1: string;
  line2: string | null;
  stateId: number;
  state: string;
  cityId: number;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  label?: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  stateId: number;
  cityId: number;
  postalCode: string;
  country?: string;
  isDefault?: boolean;
}

export type StockIssue =
  | 'OUT_OF_STOCK'
  | 'INSUFFICIENT_STOCK'
  | 'PRODUCT_INACTIVE'
  | 'PRODUCT_UNPUBLISHED'
  | null;

export interface CheckoutPreviewItem {
  cartItemId: number;
  productId: number;
  variantId: number;
  productSlug?: string | null;
  productName: string;
  variantName: string | null;
  sku: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  lineTotal: number;
  availableStock: number;
  isAvailable: boolean;
  stockIssue: StockIssue;
}

export interface CheckoutPreview {
  address: Address;
  items: CheckoutPreviewItem[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  total: number;
  hasUnavailableItems: boolean;
}

export interface CheckoutOrder {
  orderId: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  discountTotal: number;
  shippingTotal: number;
  total: number;
  shippingAddress: {
    label: string | null;
    fullName: string;
    phone: string;
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
}
