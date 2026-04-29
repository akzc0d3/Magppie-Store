"use client";

import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { createOrder } from "@/services/order.service";
import { useState } from "react";

export default function CartPage() {
    const { items, removeFromCart, updateQuantity } = useCartStore();
    const user = useAuthStore((s) => s.user);
    const openLoginModal = useUIStore((s) => s.openLoginModal);
    const [isPlacing, setIsPlacing] = useState(false);

    const clearCart = useCartStore((s) => s.clearCart);


    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );


    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to continue");
            openLoginModal();
            return;
        }

        setIsPlacing(true);


        try {
            const res = await createOrder(items);


            toast.success("Order placed successfully!");

            clearCart();

            // Next step: redirect to orders page
        } catch (error) {
            toast.error("Failed to place order");
        } finally {
            setIsPlacing(false);
        }
    };


    if (items.length === 0) {
        return (
            <main className="flex-1 p-6 flex items-center justify-center">
                <p className="text-[var(--color-muted)]">
                    Your cart is empty
                </p>
            </main>
        );
    }

    return (
        <main className="flex-1 p-6 max-w-5xl mx-auto space-y-6">

            <h1 className="text-2xl font-semibold">
                Your Cart
            </h1>

            {/* Items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className="flex gap-4 border rounded-lg p-4"
                    >

                        {/* Image */}
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                            {item.images && (
                                <img
                                    src={item.images[0]}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 flex flex-col gap-2 w-full">
                            <h3 className="font-medium">
                                {item.name}
                            </h3>

                            <p className="text-sm">
                                ₹{item.price}
                            </p>

                            {/* Quantity */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            Math.max(1, item.quantity - 1)
                                        )
                                    }
                                    className="px-2 border rounded"
                                >
                                    -
                                </button>

                                <span>{item.quantity}</span>

                                <button
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity + 1
                                        )
                                    }
                                    className="px-2 border rounded"
                                >
                                    +
                                </button>

                                {/* Remove */}
                                <Trash2Icon size={18} className="text-red-500  ml-auto cursor-pointer" onClick={() => removeFromCart(item.id)} />
                            </div>

                        </div>

                        {/* Price */}
                        <div className="font-semibold">
                            ₹{item.price * item.quantity}
                        </div>


                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-[var(--color-muted)]">
                        Total
                    </p>
                    <p className="text-lg font-semibold">
                        ₹{total}
                    </p>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className={`px-6 py-2 rounded-lg text-white ${isPlacing ? "bg-gray-400 cursor-not-allowed" : "bg-black"
                        }`}
                >
                    Place Order
                </button>
            </div>

        </main>
    );
}