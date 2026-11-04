import { mockCategories, mockProducts } from "@/lib/mock/catalog";
import { addDays } from "@/lib/mock/clock";
import { emptyCart, getState, persist, recalculateCart } from "@/lib/mock/store";
import type {
  Cart,
  Category,
  CheckoutRequest,
  CheckoutResult,
  LifeStage,
  Order,
  PaymentStatusResult,
  Product,
  Species,
} from "@/lib/types";
import { nextId } from "@/lib/utils";
import { badRequest, call, notFound } from "./client";

export interface ProductQuery {
  category?: string;
  species?: Species | "all";
  lifeStage?: LifeStage | "all";
  brand?: string;
  q?: string;
  sort?: "popular" | "price_asc" | "price_desc" | "rating";
  inStockOnly?: boolean;
  maxPrice?: number;
}

function sortProducts(items: Product[], sort: ProductQuery["sort"]) {
  const sorted = [...items];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      // "Popular" puts sponsored placements first, then review volume — and the
      // UI labels sponsored items so the ordering stays honest.
      return sorted.sort(
        (a, b) => Number(b.sponsored) - Number(a.sponsored) || b.reviewCount - a.reviewCount,
      );
  }
}

export const commerceApi = {
  /** GET /categories */
  listCategories: () =>
    call<Category[]>({
      method: "GET",
      path: "/categories",
      mock: () => mockCategories,
    }),

  /** GET /categories/:slug */
  getCategory: (slug: string) =>
    call<Category>({
      method: "GET",
      path: `/categories/${slug}`,
      mock: () => {
        const category = mockCategories.find((c) => c.slug === slug);
        if (!category) notFound("That category doesn't exist.");
        return category;
      },
    }),

  /** GET /products */
  listProducts: (query: ProductQuery = {}) =>
    call<Product[]>({
      method: "GET",
      path: "/products",
      query: {
        category: query.category,
        species: query.species,
        lifeStage: query.lifeStage,
        brand: query.brand,
        q: query.q,
        sort: query.sort,
        inStockOnly: query.inStockOnly,
        maxPrice: query.maxPrice,
      },
      mock: () => {
        const term = query.q?.trim().toLowerCase();
        const filtered = mockProducts.filter((product) => {
          if (query.category && product.categorySlug !== query.category) return false;
          if (query.species && query.species !== "all" && !product.forSpecies.includes(query.species)) {
            return false;
          }
          if (
            query.lifeStage &&
            query.lifeStage !== "all" &&
            !product.lifeStage.includes(query.lifeStage) &&
            !product.lifeStage.includes("all")
          ) {
            return false;
          }
          if (query.brand && product.brand !== query.brand) return false;
          if (query.inStockOnly && product.stockStatus === "out_of_stock") return false;
          if (query.maxPrice && product.price > query.maxPrice) return false;
          if (term) {
            const haystack =
              `${product.name} ${product.brand} ${product.categoryName} ${product.tags.join(" ")}`.toLowerCase();
            if (!haystack.includes(term)) return false;
          }
          return true;
        });
        return sortProducts(filtered, query.sort);
      },
    }),

  /** GET /products/:slug */
  getProduct: (slug: string) =>
    call<Product>({
      method: "GET",
      path: `/products/${slug}`,
      mock: () => {
        const product = mockProducts.find((p) => p.slug === slug);
        if (!product) notFound("That product is no longer available.");
        return product;
      },
    }),

  /* ----------------------------------------------------------------- cart */

  /** GET /cart */
  getCart: () =>
    call<Cart>({
      method: "GET",
      path: "/cart",
      mockLatencyMs: 150,
      mock: () => recalculateCart(getState().cart),
    }),

  /** POST /cart/items */
  addToCart: (productId: string, quantity = 1) =>
    call<Cart>({
      method: "POST",
      path: "/cart/items",
      body: { productId, quantity },
      mockLatencyMs: 250,
      mock: () => {
        const state = getState();
        const product = mockProducts.find((p) => p.id === productId || p.slug === productId);
        if (!product) notFound("That product is no longer available.");
        if (product.stockStatus === "out_of_stock") {
          badRequest("That product is out of stock right now.");
        }

        const existing = state.cart.lines.find((line) => line.productId === product.id);
        if (existing) {
          existing.quantity += quantity;
        } else {
          state.cart.lines = [
            ...state.cart.lines,
            {
              id: nextId("cln"),
              productId: product.id,
              slug: product.slug,
              name: product.name,
              brand: product.brand,
              image: product.images[0],
              unitPrice: product.price,
              compareAtPrice: product.compareAtPrice,
              quantity,
              lineTotal: product.price * quantity,
              stockStatus: product.stockStatus,
              weightLabel: product.weightLabel,
            },
          ];
        }

        recalculateCart(state.cart);
        persist();
        return state.cart;
      },
    }),

  /** PATCH /cart/items/:id */
  updateCartLine: (lineId: string, quantity: number) =>
    call<Cart>({
      method: "PATCH",
      path: `/cart/items/${lineId}`,
      body: { quantity },
      mockLatencyMs: 180,
      mock: () => {
        const state = getState();
        if (quantity <= 0) {
          state.cart.lines = state.cart.lines.filter((line) => line.id !== lineId);
        } else {
          state.cart.lines = state.cart.lines.map((line) =>
            line.id === lineId ? { ...line, quantity: Math.min(quantity, 10) } : line,
          );
        }
        recalculateCart(state.cart);
        persist();
        return state.cart;
      },
    }),

  /** DELETE /cart/items/:id */
  removeCartLine: (lineId: string) =>
    call<Cart>({
      method: "DELETE",
      path: `/cart/items/${lineId}`,
      mockLatencyMs: 180,
      mock: () => {
        const state = getState();
        state.cart.lines = state.cart.lines.filter((line) => line.id !== lineId);
        recalculateCart(state.cart);
        persist();
        return state.cart;
      },
    }),

  /** POST /cart/coupon */
  applyCoupon: (code: string) =>
    call<Cart>({
      method: "POST",
      path: "/cart/coupon",
      body: { code },
      mock: () => {
        const state = getState();
        const normalised = code.trim().toUpperCase();
        if (normalised !== "TAILISH10") {
          badRequest("That code isn't valid. Try TAILISH10 for 10% off.", { field: "code" });
        }
        state.cart.appliedCoupon = normalised;
        recalculateCart(state.cart);
        persist();
        return state.cart;
      },
    }),

  /* --------------------------------------------------------------- orders */

  /**
   * POST /checkout
   *
   * Returns the created order plus a Razorpay payment link. The browser is
   * redirected to `payment.paymentLink` — in the mock adapter that's an
   * in-app simulated payment screen rather than Razorpay's hosted page.
   */
  checkout: (request: CheckoutRequest) =>
    call<CheckoutResult>({
      method: "POST",
      path: "/checkout",
      body: request,
      mockLatencyMs: 700,
      mock: () => {
        const state = getState();
        if (state.cart.lines.length === 0) badRequest("Your cart is empty.");
        const address = state.addresses.find((a) => a.id === request.addressId);
        if (!address) badRequest("Choose a delivery address.", { field: "addressId" });

        recalculateCart(state.cart);

        const order: Order = {
          id: nextId("ord"),
          reference: `TL-${49000 + state.orders.length}`,
          lines: state.cart.lines.map((line) => ({
            id: nextId("oln"),
            productId: line.productId,
            slug: line.slug,
            name: line.name,
            brand: line.brand,
            image: line.image,
            unitPrice: line.unitPrice,
            quantity: line.quantity,
            lineTotal: line.unitPrice * line.quantity,
          })),
          status: "placed",
          paymentStatus: request.paymentMethod === "cod" ? "cod" : "pending",
          paymentMethod: request.paymentMethod,
          itemsSubtotal: state.cart.itemsSubtotal,
          deliveryFee: state.cart.deliveryFee,
          discount: state.cart.discount,
          total: state.cart.total,
          placedAt: new Date().toISOString(),
          expectedBy: addDays(3),
          address,
        };

        state.orders = [order, ...state.orders];
        state.cart = emptyCart();
        persist();

        return {
          order,
          payment: {
            id: nextId("pay"),
            provider: "razorpay" as const,
            paymentLink: `/checkout/success?order=${order.reference}&payment=simulated`,
            amount: order.total,
            status: order.paymentStatus,
          },
        };
      },
    }),

  /** GET /orders */
  listOrders: () =>
    call<Order[]>({
      method: "GET",
      path: "/orders",
      mock: () => [...getState().orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)),
    }),

  /** GET /orders/:id — accepts an id or a human reference. */
  getOrder: (idOrReference: string) =>
    call<Order>({
      method: "GET",
      path: `/orders/${idOrReference}`,
      mock: () => {
        const order = getState().orders.find(
          (o) => o.id === idOrReference || o.reference === idOrReference,
        );
        if (!order) notFound("We couldn't find that order.");
        return order;
      },
    }),

  /** POST /orders/:id/reorder */
  reorder: (orderId: string) =>
    call<Cart>({
      method: "POST",
      path: `/orders/${orderId}/reorder`,
      mockLatencyMs: 450,
      mock: () => {
        const state = getState();
        const order = state.orders.find((o) => o.id === orderId || o.reference === orderId);
        if (!order) notFound("We couldn't find that order.");

        for (const line of order.lines) {
          const product = mockProducts.find((p) => p.id === line.productId);
          if (!product || product.stockStatus === "out_of_stock") continue;
          const existing = state.cart.lines.find((l) => l.productId === product.id);
          if (existing) {
            existing.quantity += line.quantity;
          } else {
            state.cart.lines = [
              ...state.cart.lines,
              {
                id: nextId("cln"),
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                image: product.images[0],
                unitPrice: product.price,
                compareAtPrice: product.compareAtPrice,
                quantity: line.quantity,
                lineTotal: product.price * line.quantity,
                stockStatus: product.stockStatus,
                weightLabel: product.weightLabel,
              },
            ];
          }
        }

        recalculateCart(state.cart);
        persist();
        return state.cart;
      },
    }),

  /** GET /payments/:id/status */
  paymentStatus: (paymentId: string, orderReference?: string) =>
    call<PaymentStatusResult>({
      method: "GET",
      path: `/payments/${paymentId}/status`,
      mockLatencyMs: 600,
      mock: () => {
        const state = getState();
        const order = state.orders.find((o) => o.reference === orderReference) ?? state.orders[0];
        if (order && order.paymentStatus === "pending") {
          // The simulated gateway always settles successfully.
          order.paymentStatus = "paid";
          order.status = "confirmed";
          persist();
        }
        return {
          id: paymentId,
          orderId: order?.id ?? "unknown",
          status: order?.paymentStatus ?? "paid",
          method: order?.paymentMethod,
          updatedAt: new Date().toISOString(),
        };
      },
    }),
};

/** Distinct brand list, for the shop filter sidebar. */
export function allBrands() {
  return Array.from(new Set(mockProducts.map((p) => p.brand))).sort();
}
