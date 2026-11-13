import type { Order, OrderStatus, PaymentStatus } from "@/lib/types";

/** Payment method labels. Avoids CSS `capitalize` turning "upi" into "Upi". */
const PAYMENT_METHOD_LABEL: Record<NonNullable<Order["paymentMethod"]>, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net banking",
  cod: "Cash on delivery",
};

const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  pending: "Payment pending",
  paid: "Paid",
  failed: "Payment failed",
  refunded: "Refunded",
  cod: "Pay on delivery",
};

/** e.g. "UPI · Paid", or just "Paid" when the method is unknown. */
export function paymentSummaryLabel(order: Order) {
  const status = PAYMENT_STATUS_LABEL[order.paymentStatus];
  const method = order.paymentMethod ? PAYMENT_METHOD_LABEL[order.paymentMethod] : null;
  return method ? `${method} · ${status}` : status;
}

export function paymentStatusLabel(status: PaymentStatus) {
  return PAYMENT_STATUS_LABEL[status];
}

/** Presentation metadata for order status, shared by the list and detail views. */
export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; variant: "verified" | "accent" | "default" | "outline" }
> = {
  placed: { label: "Placed", variant: "default" },
  confirmed: { label: "Confirmed", variant: "default" },
  packed: { label: "Packed", variant: "accent" },
  shipped: { label: "Shipped", variant: "accent" },
  out_for_delivery: { label: "Out for delivery", variant: "accent" },
  delivered: { label: "Delivered", variant: "verified" },
  cancelled: { label: "Cancelled", variant: "outline" },
};

/** The happy-path fulfilment sequence, used to draw the progress tracker. */
export const ORDER_JOURNEY: OrderStatus[] = [
  "placed",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];
