"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/services/order.service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";
import { OrderStatus } from "@/components/order/OrderStatus";


const orderSteps = [
    { id: 1, name: "Pending" },
    { id: 2, name: "Confirmed" },
    { id: 3, name: "Shipped" },
    { id: 4, name: "Delivered" },
]
const orderMap = {
    pending: 1, confirmed: 2, shipped: 3, delivered: 4
}


export default function OrderDetailsPage() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);


    useEffect(() => {
        if (!id) return;

        const socket = getSocket();

        socket.on("order:statusUpdated", (data) => {
            if (data.orderId === id) {
                setOrder((prev) => ({
                    ...prev,
                    status: data.status,
                }));
            }
        });

        return () => {
            socket.off("order:statusUpdated");
        };
    }, [id]);

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

            <h1 className="text-2xl font-semibold tracking-tight text-black mb-4">
                Order Details
            </h1>

            {/* Status */}
            <div className="border border-slate-200 rounded-lg p-5 flex items-center justify-between bg-white">

                <div className="flex flex-col gap-1">
                    <p className="text-sm text-slate-500">Order ID</p>
                    <p className="font-medium text-black">
                        {order.id}
                    </p>
                </div>

                <span className="px-3 ml-10 py-1 rounded-full bg-black text-white text-xs font-medium capitalize">
                    {order.status}
                </span>
            </div>

            {/* Items */}
            <div className="space-y-4">
                {order.items.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between gap-4 border rounded-lg p-4"
                    >
                        <div className="flex items-center gap-6">
                            <img
                                src={item.images[0]}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                            />

                            <div>
                                <p className="font-medium">
                                    {item.name || "Product"}
                                </p>
                                <p className="text-sm text-[var(--color-muted)]">
                                    Qty: {item.quantity}
                                </p>
                            </div>
                        </div>

                        <p className="font-semibold whitespace-nowrap">
                            ₹{item.priceAtPurchase * item.quantity}
                        </p>
                    </div>
                ))}
            </div>
            <OrderStatus
                current={{ step: orderMap[order.status] }}
                steps={orderSteps}
            />
        </main>
    );
}