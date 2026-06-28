'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/cart-store';
import { fmtFCFA, cn } from '@/lib/utils';
import type { Database } from '@swiftmali/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];
type Category = Database['public']['Tables']['menu_categories']['Row'];
type Item = Database['public']['Tables']['menu_items']['Row'];

interface Props {
  restaurant: Restaurant;
  categories: Category[];
  items: Item[];
}

export function RestaurantMenu({ restaurant, categories, items }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(categories[0]?.id ?? null);
  const { addItem, items: cartItems, updateQuantity } = useCartStore();

  const getCartQty = (itemId: string) => cartItems.find((i) => i.id === itemId)?.quantity ?? 0;
  const groupedItems = categories.map((cat) => ({ category: cat, items: items.filter((i) => i.category_id === cat.id) }));
  const uncategorized = items.filter((i) => !i.category_id);

  const handleAdd = (item: Item) => {
    addItem({ id: item.id, restaurantId: restaurant.id, restaurantName: restaurant.name, name: item.name, price: item.price, quantity: 1, imageUrl: item.image_url });
    toast.success(`${item.name} ajouté au panier`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-1">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn('w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                activeCategory === cat.id ? 'bg-gold-400/10 text-gold-600 font-semibold border border-gold-400/30' : 'text-neutral-700 hover:bg-neutral-200/50')}>
              {cat.name}
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-10">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={cn('shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150',
                activeCategory === cat.id ? 'bg-gold-400 text-neutral-950 font-semibold' : 'bg-white border border-neutral-200 text-neutral-700')}>
              {cat.name}
            </button>
          ))}
        </div>

        {items.some((i) => i.is_popular) && (
          <section>
            <h2 className="font-display font-bold text-xl text-neutral-950 mb-4">🔥 Populaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.filter((i) => i.is_popular).map((item) => (
                <MenuItemCard key={item.id} item={item} qty={getCartQty(item.id)} onAdd={() => handleAdd(item)} onUpdateQty={(q) => updateQuantity(item.id, q)} />
              ))}
            </div>
          </section>
        )}

        {groupedItems.map(({ category, items: catItems }) => (
          <section key={category.id} id={`cat-${category.id}`}>
            <h2 className="font-display font-bold text-xl text-neutral-950 mb-4">{category.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catItems.map((item) => (
                <MenuItemCard key={item.id} item={item} qty={getCartQty(item.id)} onAdd={() => handleAdd(item)} onUpdateQty={(q) => updateQuantity(item.id, q)} />
              ))}
            </div>
          </section>
        ))}

        {uncategorized.length > 0 && (
          <section>
            <h2 className="font-display font-bold text-xl text-neutral-950 mb-4">Autres</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {uncategorized.map((item) => (
                <MenuItemCard key={item.id} item={item} qty={getCartQty(item.id)} onAdd={() => handleAdd(item)} onUpdateQty={(q) => updateQuantity(item.id, q)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({ item, qty, onAdd, onUpdateQty }: { item: Item; qty: number; onAdd: () => void; onUpdateQty: (q: number) => void }) {
  return (
    <div className={cn('card flex gap-4 p-4 transition-all duration-150 hover:shadow-md', !item.is_available && 'opacity-50 pointer-events-none')}>
      {item.image_url ? (
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
          <Image src={item.image_url} alt={item.name} fill className="object-cover" />
        </div>
      ) : (
        <div className="w-20 h-20 rounded-xl bg-neutral-100 flex items-center justify-center text-3xl shrink-0">🍽️</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-neutral-950 text-sm leading-tight">{item.name}</p>
        {item.description && <p className="text-neutral-400 text-xs mt-0.5 line-clamp-2">{item.description}</p>}
        {item.is_popular && <span className="inline-block mt-1 text-[10px] font-semibold text-gold-600 bg-gold-50 px-1.5 py-0.5 rounded-full">Populaire</span>}
        <div className="flex items-center justify-between mt-3">
          <span className="font-display font-bold text-neutral-950 text-sm">{fmtFCFA(item.price)}</span>
          {qty === 0 ? (
            <button onClick={onAdd} className="w-8 h-8 rounded-xl bg-gold-400 hover:bg-gold-600 text-neutral-950 flex items-center justify-center transition-all duration-150 active:scale-90"><Plus size={16} strokeWidth={2.5} /></button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => onUpdateQty(qty - 1)} className="w-7 h-7 rounded-lg bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center"><Minus size={13} /></button>
              <span className="font-display font-bold text-sm w-4 text-center">{qty}</span>
              <button onClick={onAdd} className="w-7 h-7 rounded-lg bg-gold-400 hover:bg-gold-600 flex items-center justify-center"><Plus size={13} strokeWidth={2.5} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
