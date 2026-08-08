"use client";

import {
  createContext,
  useContext,
  useReducer,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { CartItem, CartState, Product } from "@/types";

// ─── Actions ────────────────────────────────────────────────────────────────

type CartAction =
  | {
      type: "ADD_ITEM";
      payload: { product: Product; quantity: number; selectedSize?: string; selectedLength?: number };
    }
  | { type: "REMOVE_ITEM"; payload: { productId: string; selectedSize?: string } }
  | { type: "UPDATE_QTY"; payload: { productId: string; quantity: number; selectedSize?: string } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE": {
      const items = action.payload;
      return {
        items,
        totalItems: items.reduce((s, i) => s + i.quantity, 0),
        totalPrice: items.reduce(
          (s, i) =>
            s +
            i.product.price *
              i.quantity *
              (i.selectedLength ?? 1),
          0
        ),
      };
    }

    case "ADD_ITEM": {
      const { product, quantity, selectedSize, selectedLength } = action.payload;
      const key = selectedSize ?? selectedLength?.toString() ?? "default";
      const existing = state.items.find(
        (i) =>
          i.product.id === product.id &&
          (i.selectedSize ?? i.selectedLength?.toString() ?? "default") === key
      );

      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        newItems = [
          ...state.items,
          { product, quantity, selectedSize, selectedLength },
        ];
      }

      return {
        items: newItems,
        totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
        totalPrice: newItems.reduce(
          (s, i) =>
            s +
            i.product.price *
              i.quantity *
              (i.selectedLength ?? 1),
          0
        ),
      };
    }

    case "REMOVE_ITEM": {
      const { productId, selectedSize } = action.payload;
      const newItems = state.items.filter(
        (i) =>
          !(
            i.product.id === productId &&
            (selectedSize ? i.selectedSize === selectedSize : true)
          )
      );
      return {
        items: newItems,
        totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
        totalPrice: newItems.reduce(
          (s, i) =>
            s +
            i.product.price *
              i.quantity *
              (i.selectedLength ?? 1),
          0
        ),
      };
    }

    case "UPDATE_QTY": {
      const { productId, quantity, selectedSize } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, {
          type: "REMOVE_ITEM",
          payload: { productId, selectedSize },
        });
      }
      const newItems = state.items.map((i) =>
        i.product.id === productId &&
        (selectedSize ? i.selectedSize === selectedSize : true)
          ? { ...i, quantity }
          : i
      );
      return {
        items: newItems,
        totalItems: newItems.reduce((s, i) => s + i.quantity, 0),
        totalPrice: newItems.reduce(
          (s, i) =>
            s +
            i.product.price *
              i.quantity *
              (i.selectedLength ?? 1),
          0
        ),
      };
    }

    case "CLEAR_CART":
      return { items: [], totalItems: 0, totalPrice: 0 };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface CartContextValue extends CartState {
  addItem: (
    product: Product,
    quantity?: number,
    selectedSize?: string,
    selectedLength?: number
  ) => void;
  removeItem: (productId: string, selectedSize?: string) => void;
  updateQty: (
    productId: string,
    quantity: number,
    selectedSize?: string
  ) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "bakale-nx-cart";

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: CartItem[] = JSON.parse(stored);
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items]);

  const addItem = (
    product: Product,
    quantity = 1,
    selectedSize?: string,
    selectedLength?: number
  ) => {
    dispatch({ type: "ADD_ITEM", payload: { product, quantity, selectedSize, selectedLength } });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string, selectedSize?: string) =>
    dispatch({ type: "REMOVE_ITEM", payload: { productId, selectedSize } });

  const updateQty = (productId: string, quantity: number, selectedSize?: string) =>
    dispatch({ type: "UPDATE_QTY", payload: { productId, quantity, selectedSize } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
