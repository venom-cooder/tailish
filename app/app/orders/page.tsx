"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Loader2, Package, RotateCcw, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PortalHeader } from "@/components/portal/portal-shell";
import { EmptyState, ErrorState, LoadingState } from "@/components/shared/states";
import { useCart } from "@/components/providers/cart-provider";
import { ORDER_STATUS_META, paymentStatusLabel } from "@/components/portal/order-status";
import { api } from "@/lib/api";
import { useAsync, useMutation } from "@/lib/hooks/use-async";
import type { Order } from "@/lib/types";
import { formatDate, formatINR } from "@/lib/utils";

export default function OrdersPage() {
  const orders = useAsync<Order[]>(() => api.commerce.listOrders(), []);

  return (
    <>
      <PortalHeader title="Orders" description="Everything you've ordered from the Tailish shop.">
        <Button asChild variant="outline">
          <Link href="/shop">
            <ShoppingBag className="size-4" aria-hidden="true" />
            Shop
          </Link>
        </Button>
      </PortalHeader>

      {orders.loading ? (
        <LoadingState label="Loading your orders" rows={3} />
      ) : orders.error ? (
        <ErrorState message={orders.error} onRetry={orders.refresh} />
      ) : (orders.data ?? []).length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Food, supplements and everything else your pet needs, delivered across Indore within 48 hours."
          action={
            <Button asChild>
              <Link href="/shop">Browse the shop</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-4">
          {orders.data?.map((order) => (
            <li key={order.id}>
              <OrderCard order={order} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function OrderCard({ order }: { order: Order }) {
  const { setOpen } = useCart();
  const meta = ORDER_STATUS_META[order.status];

  const reorder = useMutation(async () => {
    const result = await api.commerce.reorder(order.id);
    setOpen(true);
    return result;
  });

  return (
    <article className="rounded-3xl border border-hairline bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={meta.variant}>{meta.label}</Badge>
            <span className="text-xs tabular text-muted">{order.reference}</span>
          </div>

          <p className="mt-2 text-sm text-muted">
            Placed {formatDate(order.placedAt)}
            {order.deliveredAt
              ? ` · Delivered ${formatDate(order.deliveredAt)}`
              : order.expectedBy
                ? ` · Expected by ${formatDate(order.expectedBy)}`
                : ""}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <p className="tabular text-xl font-bold text-ink">{formatINR(order.total)}</p>
          <p className="mt-0.5 text-xs text-muted">{paymentStatusLabel(order.paymentStatus)}</p>
        </div>
      </div>

      <ul className="mt-5 flex flex-wrap gap-3">
        {order.lines.map((line) => (
          <li key={line.id} className="flex items-center gap-3">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-cream">
              <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-brand-700 text-[0.65rem] font-bold text-white">
                {line.quantity}
              </span>
            </span>
            <span className="max-w-44 text-xs leading-snug text-muted">{line.name}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-5">
        <Button asChild size="sm" variant="outline">
          <Link href={`/app/orders/${order.reference}`}>
            Order details
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Button>

        <Button size="sm" variant="ghost" disabled={reorder.pending} onClick={() => void reorder.run()}>
          {reorder.pending ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <RotateCcw className="size-4" aria-hidden="true" />
          )}
          Reorder
        </Button>

        {order.trackingLink ? (
          <Button asChild size="sm" variant="ghost">
            <a href={order.trackingLink} target="_blank" rel="noopener noreferrer">
              Track shipment
            </a>
          </Button>
        ) : null}
      </div>

      {reorder.error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {reorder.error}
        </p>
      ) : null}
    </article>
  );
}
