'use client';

import Link from 'next/link';
import { ShoppingBag, MapPin, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { cn } from '@/lib/utils';

export function Navbar() {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <header className="sticky top-0 z-50 bg-neutral-100/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display font-bold text-xl text-neutral-950">
            Swift<span className="text-gold-400">Eats</span>
          </span>
        </Link>
        <button className="flex items-center gap-1.5 text-sm text-neutral-700 hover:text-neutral-950 transition-colors">
          <MapPin size={15} className="text-gold-400 shrink-0" />
          <span className="hidden sm:block truncate max-w-[180px]">Bamako, Mali</span>
          <ChevronDown size={14} />
        </button>
        <Link
          href="/cart"
          className={cn(
            'relative flex items-center gap-2 px-4 py-2 rounded-xl font-display font-semibold text-sm',
            'bg-neutral-950 text-white hover:bg-neutral-900 transition-all duration-150 active:scale-[.97]'
          )}
        >
          <ShoppingBag size={16} />
          <span className="hidden sm:block">Panier</span>
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 badge animate-pop">{itemCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
