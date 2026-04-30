"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { getMyOrders } from "@/services/order.service";
import { toast } from "sonner";
import Link from "next/link";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const openLoginModal = useUIStore((s) => s.openLoginModal);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      openLoginModal();
      return;
    }

    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <main className="flex-1 p-6 text-center">
        Please login to view profile
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
      
      {/* User Info */}
      <div>
        <h1 className="text-2xl font-semibold">
          {user.name}
        </h1>
        <p className="text-sm text-[var(--color-muted)]">
          {user.email}
        </p>
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Your Orders
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : orders.length === 0 ? (
          <p className="text-[var(--color-muted)]">
            No orders yet
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block border rounded-lg p-4 hover:shadow-sm transition"
              >
                
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[var(--color-muted)]">
                      Order ID
                    </p>
                    <p className="font-medium">
                      {order.id}
                    </p>
                  </div>

                  <div className="text-sm">
                       <span className="px-3 ml-10 py-1 rounded-full bg-black text-white text-xs font-medium capitalize">
                    {order.status}
                </span>
                  </div>
                </div>

                <p className="text-sm text-[var(--color-muted)] mt-2">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

              </Link>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}