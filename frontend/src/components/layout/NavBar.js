"use client";

import { ShoppingCart, User, UserStar } from "lucide-react";
import { useCartStore } from "@/store/useCartStore.js";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { useRole } from "@/hooks/useRole";

export default function Navbar() {
    const { isAdmin } = useRole();
    const items = useCartStore((state) => state.items);
    const openLoginModal = useUIStore((state) => state.openLoginModal);
    const totalCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);


    return (
        <header className="border-b border-[var(--color-border)] bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="relative">
                    <div className="font-semibold text-lg">
                        Magppie
                    </div>
                </Link>



                {/* Actions */}


                <div className="flex items-center gap-4">
                    {/* Cart */}
                    <Link href="/cart" className="relative">
                        <button className="relative">
                            <ShoppingCart size={22} />
                            <span className="absolute -top-2 -right-2 text-xs bg-black text-white px-1.5 py-0.5 rounded-full">
                                {totalCount}
                            </span>
                        </button>
                    </Link>


                    {/* Auth */}

                    {user ? (
                        <Link
                            href="/profile"
                            className="text-sm border px-3 py-1.5 rounded-lg"
                        >
                            {user.name || "Profile"}
                        </Link>
                    ) : (
                        <button
                            onClick={openLoginModal}
                            className="hidden md:flex items-center gap-2 text-sm border px-3 py-1.5 rounded-lg"
                        >
                            <User size={16} />
                            Login
                        </button>
                    )}


                    {/* Admin Button */}
                    {isAdmin && (
                        <Link
                            href="/admin/orders"
                            className="hidden md:block text-sm border px-3 py-1.5 rounded-lg"
                        >
                            Admin Dashboard
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
}