// ============================================================
// Bakale Nx — Shared TypeScript Types
// ============================================================

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  subCategory?: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  isCutPiece: boolean;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  features: string[];
  availableSizes?: string[];
  tags?: string[];
  isNew?: boolean;
  isBestseller?: boolean;
}

export type ProductCategory =
  | "Suiting"
  | "Shirting"
  | "Readymade Shirt"
  | "Trouser"
  | "Ethnic"
  | "Accessories";

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedLength?: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Review {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  language?: "en" | "mr";
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  totalPrice: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered";
  createdAt: string;
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  brand: string;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "newest";
