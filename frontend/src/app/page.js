
"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import SearchBar from "@/components/product/SearchBar";
import { searchProducts } from "@/services/product.service";
import { toast } from "sonner";



export default function Home() {
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
    });
    const [searchParams, setSearchParams] = useState({});
    const handleSearch = async (params, page = 1) => {
        try {
            const res = await searchProducts({ ...params, page });
            const { products, pagination } = res.data;
            setSearchParams(params);

            setProducts(products || []);

            setPagination({
                page: Number(pagination.page),
                totalPages: Number(pagination.totalPages),
            });
        } catch (error) {
            toast.error("Failed to fetch products");
        }
    };

    const handlePageChange = (newPage) => {
        handleSearch(searchParams, newPage);
    };

    return (
        <main className="flex-1">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
                <SearchBar onSearch={handleSearch} />

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                </div>
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-6">

                        {/* Prev */}
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Prev
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: pagination.totalPages }).map((_, i) => {
                            const page = i + 1;

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-1 rounded ${page === pagination.page
                                        ? "bg-black text-white"
                                        : "border"
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        {/* Next */}
                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-3 py-1 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>

                    </div>

                )}

            </div>
        </main>
    );
}
