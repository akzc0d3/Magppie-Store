"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/services/order.service";
import { toast } from "sonner";
import Link from "next/link";





const groupOrdersByUser = (orders) => {
  return orders.reduce((acc, order) => {
    const userId = order.userId || "unknown";

    if (!acc[userId]) {
      acc[userId] = [];
    }

    acc[userId].push(order);

    return acc;
  }, {});
};





export default function AdminOrdersPage() {


  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAllOrders()

      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const groupedOrders = groupOrdersByUser(orders);
  return (
    <main className="flex-1 p-6 max-w-6xl mx-auto space-y-6">

      <h1 className="text-2xl font-semibold">
        Admin Orders Dashboard
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-[var(--color-muted)]">
          No orders found
        </p>
      ) : (
        <div className="space-y-4">


          {Object.entries(groupedOrders).map(([userId, userOrders]) => (
            <div key={userId} className="border rounded-lg p-4 space-y-3">

              {/* User Header */}
              <div className="flex justify-between items-center border-b pb-2">
                <h2 className="font-semibold">
                  User ID: {userId}
                </h2>

                <span className="text-sm text-[var(--color-muted)]">
                  {userOrders.length} orders
                </span>
              </div>

              {/* Orders under user */}
              <div className="space-y-3">
                {userOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`orders/${order.id}`}
                    className="block border rounded-lg p-3 hover:shadow-sm transition"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        Order #{order.id}
                      </p>

                      <span className="px-2 py-1 text-xs bg-gray-100 rounded">
                        {order.status}
                      </span>
                    </div>

                    <p className="text-xs text-[var(--color-muted)] mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </Link>
                ))}
              </div>

            </div>
          ))}

        </div>
      )}

    </main>
  );
}
