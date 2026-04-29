"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/services/order.service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/services/order.service";

export default function OrderDetailsPage() {




    const { id } = useParams();
    const [updating, setUpdating] = useState(false);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState("");


    useEffect(() => {
        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (order?.status) {
            setSelectedStatus(order.status);
        }
    }, [order]);

    const fetchOrder = async () => {
        try {
            const res = await getOrderById(id);
            setOrder(res.data);
        } catch (err) {
            toast.error("Failed to fetch order");
        } finally {
            setLoading(false);
        }
    };


const handleStatusChange = async (newStatus) => {
    if (!newStatus || newStatus === order.status) return;

    try {
        setUpdating(true);

        await updateOrderStatus(order.id, newStatus);

        setOrder((prev) => ({
            ...prev,
            status: newStatus,
        }));

        toast.success("Order status updated");
    } catch (err) {
        toast.error("Failed to update status");
    } finally {
        setUpdating(false);
    }
};



    if (loading) {
        return (
            <main className="flex-1 p-6">Loading...</main>
        );
    }

    if (!order) {
        return (
            <main className="flex-1 p-6">
                Order not found
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 max-w-4xl mx-auto space-y-6">

            <h1 className="text-2xl font-semibold">
                Order Details
            </h1>

            {/* Status */}
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <p className="font-medium">
                    Order ID: {order.id}
                </p>

                <div className="flex items-center gap-3">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        disabled={updating}
                        className="border rounded-lg px-3 py-1 text-sm"
                    >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                    </select>

                    {updating && (
                        <span className="text-xs text-[var(--color-muted)]">
                            Updating...
                        </span>
                    )}

                </div>
            </div>

            {/* Items */}
            <div className="space-y-4">
                {order.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between border rounded-lg p-4"
                    >
                        <div>
                            <img

                                src={item.images[0]}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md"
                            />
                        </div>
                        <div>
                            <p className="font-medium">
                                {item.name || "Product"}
                            </p>
                            <p className="text-sm text-[var(--color-muted)]">
                                Qty: {item.quantity}
                            </p>
                        </div>

                        <p className="font-semibold">
                            ₹{item.priceAtPurchase * item.quantity}
                        </p>
                    </div>
                ))}
            </div>
<div className="border-t pt-4 mt-4">
    <button
        onClick={() => handleStatusChange(selectedStatus)}
        disabled={updating || selectedStatus === order.status}
        className="w-full bg-black text-white py-9.5 px-4 rounded-xl text-base font-semibold disabled:opacity-50 shadow-sm hover:shadow-md transition"
    >
        {updating ? "Updating..." : "Update Order Status"}
    </button>
</div>
        </main>
    );
}