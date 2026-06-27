import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; restaurantId: string; restaurantName: string;
  name: string; price: number; quantity: number;
  notes?: string; imageUrl?: string | null;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [], restaurantId: null,
      addItem: (item) => {
        const { items, restaurantId } = get();
        if (restaurantId && restaurantId !== item.restaurantId) {
          set({ items: [{ ...item, quantity: 1 }], restaurantId: item.restaurantId }); return;
        }
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
          set({ items: items.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i) });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], restaurantId: item.restaurantId });
        }
      },
      removeItem: (id) => set((s) => ({
        items: s.items.filter((i) => i.id !== id),
        restaurantId: s.items.length === 1 ? null : s.restaurantId,
      })),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) { get().removeItem(id); return; }
        set((s) => ({ items: s.items.map((i) => i.id === id ? { ...i, quantity } : i) }));
      },
      clearCart: () => set({ items: [], restaurantId: null }),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      total: () => get().subtotal(),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'swifteats-cart' }
  )
);
