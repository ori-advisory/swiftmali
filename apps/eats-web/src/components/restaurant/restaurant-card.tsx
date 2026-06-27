import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Bike } from 'lucide-react';
import { fmtFCFA, fmtDuration, cn } from '@/lib/utils';
import type { Database } from '@swiftmali/supabase/types';

type Restaurant = Database['public']['Tables']['restaurants']['Row'];

const CATEGORY_EMOJI: Record<string, string> = {
  'Malien': '🍲', 'Ivoirien': '🐟', 'Fast-food': '🍔',
  'Africain': '🍛', 'Supermarché': '🛒', 'Boulangerie': '🥐',
};

export function RestaurantCard({ restaurant, className }: { restaurant: Restaurant; className?: string }) {
  const emoji = CATEGORY_EMOJI[restaurant.category] ?? '🍽️';
  const avgTime = Math.round((restaurant.delivery_time_min + restaurant.delivery_time_max) / 2);

  return (
    <Link
      href={`/restaurant/${restaurant.slug}`}
      className={cn('group card hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block', !restaurant.is_open && 'opacity-60', className)}
    >
      <div className="relative h-44 bg-neutral-100 overflow-hidden">
        {restaurant.image_url ? (
          <Image src={restaurant.image_url} alt={restaurant.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">{emoji}</div>
        )}
        {restaurant.is_featured && <span className="absolute top-3 left-3 tag bg-gold-400 text-neutral-950 text-xs font-semibold">⭐ Top</span>}
        {!restaurant.is_open && (
          <div className="absolute inset-0 bg-neutral-950/50 flex items-center justify-center">
            <span className="bg-neutral-950 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Fermé</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display font-bold text-neutral-950 text-base leading-tight">{restaurant.name}</h3>
          <div className="flex items-center gap-1 shrink-0 text-sm text-neutral-700">
            <Star size={13} className="text-gold-400 fill-gold-400" />
            <span className="font-medium">{restaurant.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-neutral-400 text-sm mb-3 line-clamp-1">{restaurant.category} · {restaurant.commune}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {restaurant.tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400 pt-3 border-t border-neutral-100">
          <span className="flex items-center gap-1"><Bike size={12} className="text-gold-400" />{restaurant.delivery_fee === 0 ? 'Livraison offerte' : fmtFCFA(restaurant.delivery_fee)}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{fmtDuration(avgTime)}</span>
          <span className="ml-auto">Min. {fmtFCFA(restaurant.min_order)}</span>
        </div>
      </div>
    </Link>
  );
}
