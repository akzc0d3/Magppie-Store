"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [priceMin, setMinPrice] = useState("");
  const [priceMax, setMaxPrice] = useState("");

  const handleSearch = () => {
    onSearch({ name, category, priceMin, priceMax, page: 1, limit: 10,});
  };

  return (
    <div className="w-full border border-[var(--color-border)] rounded-xl p-4 flex flex-col gap-4">
      
      {/* Top Row */}
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
          <Search size={18} className="text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm"
        />

      </div>
    </div>
  );
}