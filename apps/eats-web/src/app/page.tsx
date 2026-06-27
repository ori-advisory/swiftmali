import { Suspense } from 'react';
import { Search } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { RestaurantCard } from '@/components/restaurant/restaurant-card';
import { createClient } from '@/lib/supabase';

const CATEGORIES = [
  { id: 'all', label: '🍽️ Tout' }, { id: 'Malien', label: '🍲 Malien' },
  { id: 'Fast-food', label: '🍔 Fast-food' }, { id: 'Ivoirien', label: '🐟 Ivoirien' },
  { id: 'Africain', label: '🍛 Africain' }, { id: 'Supermarché', label: '🛒 Supermarché' },
  { id: 'Boulangerie', label: '🥐 Boulangerie' },
];

async function Restaurants({ category }: { category?: string }) {
  const supabase = createClient();
  let query = supabase.from('restaurants').select('*').order('is_featured', { ascending: false }).order('rating', { ascending: false });
  if (category && category !== 'all') query = query.eq('category', category);
  const { data: restaurants } = await query;

  if (!restaurants?.length) return (
    <div className="py-20 text-center text-neutral-400">
      <p className="text-4xl mb-4">🍽️</p>
      <p className="font-display font-semibold text-neutral-700">Aucun restaurant trouvé</p>
    </div>
  );
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
    </div>
  );
}

async function FeaturedRestaurants() {
  const supabase = createClient();
  const { data } = await supabase.from('restaurants').select('*').eq('is_featured', true).eq('is_open', true).order('rating', { ascending: false }).limit(3);
  if (!data?.length) return null;
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{data.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}</div>;
}

function Skeleton({ count }: { count: number }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: count }).map((_, i) => <div key={i} className="card animate-pulse"><div className="h-44 bg-neutral-200" /><div className="p-4 space-y-3"><div className="h-4 bg-neutral-200 rounded w-3/4" /><div className="h-3 bg-neutral-200 rounded w-1/2" /></div></div>)}</div>;
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="bg-neutral-950 text-white py-14 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-white mb-2">Que mangez-vous<br /><span className="text-gold-400">aujourd'hui ?</span></h1>
            <p className="text-neutral-400 text-base mb-8">Les meilleurs restaurants de Bamako, livrés en moto.</p>
            <div className="relative max-w-lg">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="search" placeholder="Restaurant, plat, quartier…" className="w-full bg-white/10 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-gold-400/60 transition-all duration-150" />
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
            {CATEGORIES.map((cat) => (
              <a key={cat.id} href={cat.id === 'all' ? '/' : `/?category=${cat.id}`}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  (category ?? 'all') === cat.id ? 'bg-gold-400 text-neutral-950 font-semibold' : 'bg-white border border-neutral-200 text-neutral-700 hover:border-gold-400'
                }`}>{cat.label}</a>
            ))}
          </div>
          {(!category || category === 'all') && (
            <div className="mb-8">
              <h2 className="font-display font-bold text-xl text-neutral-950 mb-4">⭐ Coups de cœur</h2>
              <Suspense fallback={<Skeleton count={3} />}><FeaturedRestaurants /></Suspense>
            </div>
          )}
          <div>
            <h2 className="font-display font-bold text-xl text-neutral-950 mb-4">
              {category && category !== 'all' ? CATEGORIES.find((c) => c.id === category)?.label : '🍽️ Tous les restaurants'}
            </h2>
            <Suspense fallback={<Skeleton count={6} />}><Restaurants category={category} /></Suspense>
          </div>
        </section>
      </main>
      <footer className="border-t border-neutral-200 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <span className="font-display font-bold text-neutral-950">Swift<span className="text-gold-400">Eats</span></span>
          <span>© 2026 SwiftMali · eats.ori-advisory.com</span>
          <div className="flex gap-4"><a href="#" className="hover:text-neutral-700">CGV</a><a href="#" className="hover:text-neutral-700">Aide</a></div>
        </div>
      </footer>
    </>
  );
}
