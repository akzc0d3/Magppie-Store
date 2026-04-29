import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const items = get().items;
        const existing = items.find((i) => i.id === product.id);

        if (existing) {
          const updated = items.map((i) =>
            i.id === product.id
              ? { ...i, quantity: i.quantity + product.quantity }
              : i
          );
          set({ items: updated });
        } else {
          set({ items: [...items, product] });
        }
      },

      removeFromCart: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
        });
      },

      updateQuantity: (id, quantity) => {
        const updated = get().items.map((i) =>
          i.id === id ? { ...i, quantity } : i
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);