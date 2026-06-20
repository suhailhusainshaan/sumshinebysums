export interface CartItem {
  cartItemId: number;
  productId: number;
  variantId: number;
  productName: string;
  productSlug: string;
  variantName: string | null;
  sku: string;
  quantity: number;
  unitPrice: number;
  compareAtPrice: number | null;
  lineTotal: number;
  availableStock: number;
  isAvailable: boolean;
  imageUrl: string | null;
  stockIssue: 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK' | 'PRODUCT_INACTIVE' | 'PRODUCT_UNPUBLISHED' | null;
}

export interface Cart {
  cartId: number;
  items: CartItem[];
  itemCount: number;
  totalQuantity: number;
  subtotal: number;
  shippingCharge: number;
  discountTotal: number;
  appliedPromoCodes: string[];
  total: number;
  hasUnavailableItems: boolean;
}

export interface CartApiResponse<T = Cart> {
  data: T;
  message: string;
  status: boolean;
}

export interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}
