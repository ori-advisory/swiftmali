import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/navbar';
import { RestaurantMenu } from '@/components/restaurant/restaurant-menu';
import { createClient } from '@/lib/supabase';
import { Star, Clock, Bike, MapPin } from 'lucide-react';
import { fmtFCFA, fmtDuration } from '@/lib/utils';

interface Props { params: Promise<{ slug: string }>; }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data } = await supabase.from('restaurants').select('name, description').eq('slug', slug).single();
  if (!data) return { title: 'Restaurant introuvable' };
  return { title: data.name, description: data.description ?? undefined };
}

export default async function RestaurantPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createClient();

  const { data: restaurant } = await supabase.from('restaurants').select('*').eq('slug', slug).single();
  if (!restaurant) return notFound();

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('menu_categories').select('*').eq('restaurant_id', restaurant.id).order('position'),
    supabase.from('menu_items').select('*').eq('restaurant_id', restaurant.id).eq('is_available', true).order('position'),
  ]);

  const avgTime = Math.round((restaurant.delivery_time_min + restaurant.delivery_time_max) / 2);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-neutral-950 text-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center text-4xl shrink-0">🍽️</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl">{restaurant.name}</h1>
                  {!restaurant.is_open && <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full">Fermé</span>}
                </div>
                <p className="text-neutral-400 text-sm mb-4 line-clamp-2">{restaurant.description}</p>
                <div className="flex flex-wrap gap-4 text-sm text-neutral-300">
                  <span className="flex items-center gap-1.5"><Star size={14} className="text-gold-400 fill-gold-400" /><span className="font-semibold text-white">{restaurant.rating.toFixed(1)}</span><span className="text-neutral-500">({restaurant.rating_count} avis)</span></span>
                  <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold-400" />{fmtDuration(avgTime)}</span>
                  <span className="flex items-center gap-1.5"><Bike size={14} className="text-gold-400" />{restaurant.delivery_fee === 0 ? 'Livraison offerte' : fmtFCFA(restaurant.delivery_fee)}</span>
                  <span className="flex items-center gap-1.5"><MapPin size={14} className="text-gold-400" />{restaurant.commune}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <RestaurantMenu restaurant={restaurant} categories={categories ?? []} items={items ?? []} />
        </div>
      </main>
    </>
  );
}
