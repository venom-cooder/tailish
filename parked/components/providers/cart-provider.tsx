"use client";

import * as React from "react";
import { api, toErrorMessage } from "@/lib/api";
import type { Cart } from "@/lib/types";
import { emptyCart } from "@/lib/mock/store";

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  error: string | null;
  /** Slide-out cart visibility. */
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (productId: string, quantity?: number) => Promise<boolean>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<string | null>;
  refresh: () => Promise<void>;
  /** Product id currently being added, for per-button pending state. */
  pendingProductId: string | null;
}

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = React.useState<Cart>(emptyCart);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [pendingProductId, setPendingProductId] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    try {
      setCart(await api.commerce.getCart());
      setError(null);
    } catch (cause) {
      setError(toErrorMessage(cause));
    } finally {
      setLoading(false);
    }
  }, []);

  // The cart lives in the mock store / backend session, so it is loaded after
  // mount rather than rendered on the server — this keeps the static shell
  // identical for every visitor. State is only set from the promise callbacks,
  // never synchronously in the effect body.
  React.useEffect(() => {
    let active = true;

    api.commerce
      .getCart()
      .then((loaded) => {
        if (!active) return;
        setCart(loaded);
        setError(null);
      })
      .catch((cause) => {
        if (active) setError(toErrorMessage(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const addItem = React.useCallback(async (productId: string, quantity = 1) => {
    setPendingProductId(productId);
    setError(null);
    try {
      setCart(await api.commerce.addToCart(productId, quantity));
      setOpen(true);
      return true;
    } catch (cause) {
      setError(toErrorMessage(cause));
      return false;
    } finally {
      setPendingProductId(null);
    }
  }, []);

  const updateLine = React.useCallback(async (lineId: string, quantity: number) => {
    try {
      setCart(await api.commerce.updateCartLine(lineId, quantity));
    } catch (cause) {
      setError(toErrorMessage(cause));
    }
  }, []);

  const removeLine = React.useCallback(async (lineId: string) => {
    try {
      setCart(await api.commerce.removeCartLine(lineId));
    } catch (cause) {
      setError(toErrorMessage(cause));
    }
  }, []);

  const applyCoupon = React.useCallback(async (code: string) => {
    try {
      setCart(await api.commerce.applyCoupon(code));
      return null;
    } catch (cause) {
      return toErrorMessage(cause);
    }
  }, []);

  const value = React.useMemo<CartContextValue>(
    () => ({
      cart,
      loading,
      error,
      open,
      setOpen,
      addItem,
      updateLine,
      removeLine,
      applyCoupon,
      refresh,
      pendingProductId,
    }),
    [cart, loading, error, open, addItem, updateLine, removeLine, applyCoupon, refresh, pendingProductId],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = React.useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>");
  return context;
}
