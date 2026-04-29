"use client";

import { useEffect, useState } from "react";
import { getOrderById } from "@/services/order.service";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { getSocket } from "@/lib/socket";


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

            <h1 className="text-2xl font-semibold">
                Order Details
            </h1>

            {/* Status */}
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <p className="font-medium">
                    Order ID: {order.id}
                </p>

                <span className="px-3 py-1 rounded bg-gray-100 text-sm">
                    {order.status}
                </span>
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

        </main>
    );
}