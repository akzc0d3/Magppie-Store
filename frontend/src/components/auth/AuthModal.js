"use client";

import { useState } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";


export default function AuthModal() {
    const { isLoginModalOpen, closeLoginModal } = useUIStore();
    const [isLogin, setIsLogin] = useState(true);

    const { login, signup, isLoading } = useAuthStore();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    if (!isLoginModalOpen) return null;


    const handleSubmit = async () => {
        try {
            if (isLogin) {
                await login({
                    email: form.email,
                    password: form.password,
                });
                toast.success("Logged in successfully");
            } else {
                await signup({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                    role: form.role
                });
                toast.success("Account created");
                setIsLogin(true);
            }

            closeLoginModal();
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-full max-w-md rounded-xl p-6 relative">

                {/* Close */}
                <button
                    onClick={closeLoginModal}
                    className="absolute top-3 right-3 text-sm"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    {isLogin ? "Login" : "Sign Up"}
                </h2>

                {/* Form */}
                <div className="flex flex-col gap-3">

                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Name"
                            className="border rounded-lg px-3 py-2 text-sm"
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    )}

                    <input
                        type="email"
                        placeholder="Email"
                        className="border rounded-lg px-3 py-2 text-sm"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="border rounded-lg px-3 py-2 text-sm"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    {!isLogin && (
                        <select
                            className="border rounded-lg px-3 py-2 text-sm bg-white"
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-black text-white py-2 rounded-lg text-sm mt-2 disabled:opacity-50"
                    >
                        {isLoading
                            ? "Please wait..."
                            : isLogin
                                ? "Login"
                                : "Create Account"}
                    </button>

                </div>

                {/* Toggle */}
                <p className="text-sm mt-4 text-center">
                    {isLogin ? "Don’t have an account?" : "Already have an account?"}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-1 text-blue-600"
                    >
                        {isLogin ? "Sign up" : "Login"}
                    </button>
                </p>

            </div>
        </div>
    );
}