"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";


export default function ProductCard({ product }) {
    const addToCart = useCartStore((state) => state.addToCart);
    const [quantity, setQuantity] = useState(1);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const { name, price, images, } = product

    const handleIncrease = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrease = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleAddToCart = () => {
        addToCart({
            ...product,
            quantity,
        });

        toast.success("Added to cart");
    };

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) =>
                prev === images.length - 1 ? 0 : prev + 1
            );
        }, 2000);

        return () => clearInterval(interval);
    }, [images]);

    return (
        <div className="border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-3 hover:shadow-sm transition">

            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">

                {images.length > 0 ? (
                    <>
                        {/* Sliding Images */}
                        <div
                            className="flex transition-transform duration-500 ease-in-out h-full"
                            style={{
                                transform: `translateX(-${currentImageIndex * 100}%)`,
                            }}
                        >
                            {images.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={name}
                                    className="w-full h-full object-cover flex-shrink-0"
                                />
                            ))}
                        </div>

                        {/* Dots Indicator (optional but nice UX) */}
                        {images.length > 1 && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                {images.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-1.5 rounded-full ${i === currentImageIndex
                                            ? "bg-white"
                                            : "bg-white/50"
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <span className="text-sm text-[var(--color-muted)]">
                            No Image
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1">
                <h3 className="text-sm font-medium line-clamp-2">
                    {name}
                </h3>
                <p className="font-semibold">
                    ₹{price}
                </p>
            </div>

            {/* Quantity + Button */}
            <div className="flex items-center gap-2 mt-auto">

                {/* Quantity Selector */}
                <div className="flex items-center border border-[var(--color-border)] rounded-lg overflow-hidden">
                    <button
                        onClick={handleDecrease}
                        className="px-2 py-1 text-sm hover:bg-gray-100"
                    >
                        -
                    </button>

                    <span className="px-3 text-sm">
                        {quantity}
                    </span>

                    <button
                        onClick={handleIncrease}
                        className="px-2 py-1 text-sm hover:bg-gray-100"
                    >
                        +
                    </button>
                </div>

                {/* Add to Cart */}
                <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-black text-white text-sm py-2 rounded-lg hover:opacity-90 transition"
                >
                    Add
                </button>
            </div>
        </div>
    );
}
