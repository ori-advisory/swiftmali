'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, ChefHat, Bike, Package, Star } from 'lucide-react';
import { Navbar } from '@/components/layout/navbar';
import { createClient } from '@/lib/supabase';
import { fmtFCFA, cn } from '@/lib/utils';
import type { Database } from '@swiftmali/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderStatus = Order['status'];

const STATUS_STEPS: { status: OrderStatus; label: string; icon: React.ElementType }[] = [
  { status: 'pending',    label: 'Commande reçue',         icon: Clock },
  { status: 'confirmed',  label: 'Confirmée',              icon: CheckCircle2 },
  { status: 'preparing',  label: 'En préparation',         icon: ChefHat },
  { status: 'ready',      label: 'Prête pour la collecte', icon: Package },
  { status: 'picking_up', label: 'Livreur en route',       icon: Bike },
  { status: 'delivering', label: 'En chemin vers vous',    icon: Bike },
  { status: 'delivered',  label: 'Livré !',                icon: CheckCircle2 },
];

const STATUS_INDEX: Record<OrderStatus, number> = Object.fromEntries(
  STATUS_STEPS.map((s, i) => [s.status, i])
) as Record<OrderStatus, number>;

export default function TrackPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    void supabase.from('orders').select('*').eq('id', orderId).single().then(({ data }) => { setOrder(data); setLoading(false); });
    const channel = supabase.channel(`order-${orderId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` }, (payload) => setOrder(payload.new as Order))
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [orderId]);

  if (loading) return (<><Navbar /><main className="min-h-screen flex items-center justify-center"><span className="inline-block w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" /></main></>);
  if (!order) return (<><Navbar /><main className="min-h-screen flex flex-col items-center justify-center p-8 text-center"><p className="text-4xl mb-4">😕</p><h1 className="font-display font-bold text-xl mb-4">Commande introuvable</h1><Link href="/" className="btn-primary">Retour à l'accueil</Link></main></>);

  const currentIdx = STATUS_INDEX[order.status] ?? 0;
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <>
      <Navbar />
      <main className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{isDelivered ? '🎉' : isCancelled ? '😞' : '🛵'}</div>
          <h1 className="font-display font-extrabold text-2xl text-neutral-950 mb-1">{isDelivered ? 'Livré !' : isCancelled ? 'Commande annulée' : 'Suivi en direct'}</h1>
          <p className="text-neutral-400 text-sm">Commande {order.order_number}</p>
        </div>
        {!isCancelled && (
          <div className="card p-6 mb-6">
            <div className="space-y-4">
              {STATUS_STEPS.filter((s) => s.status !== 'cancelled').map((step, idx) => {
                const Icon = step.icon;
                const isPast = idx < currentIdx; const isCurrent = idx === currentIdx;
                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all', isPast && 'bg-green-50 text-green-600', isCurrent && 'bg-gold-400 text-neutral-950', !isPast && !isCurrent && 'bg-neutral-100 text-neutral-300')}><Icon size={16} /></div>
                    <span className={cn('text-sm font-medium flex-1', isCurrent && 'text-neutral-950 font-semibold', !isPast && !isCurrent && 'text-neutral-400')}>{step.label}</span>
                    {isCurrent && <span className="text-xs text-gold-600 font-semibold bg-gold-50 px-2 py-0.5 rounded-full">En cours</span>}
                    {isPast && <CheckCircle2 size={14} className="text-green-600" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="card p-4 mb-6 space-y-2">
          <h2 className="font-display font-semibold text-neutral-950 mb-3">Récapitulatif</h2>
          <div className="flex justify-between text-sm text-neutral-700"><span>Sous-total</span><span>{fmtFCFA(order.subtotal)}</span></div>
          <div className="flex justify-between text-sm text-neutral-700"><span>Livraison</span><span>{fmtFCFA(order.delivery_fee)}</span></div>
          <div className="flex justify-between font-display font-bold pt-2 border-t border-neutral-100"><span>Total</span><span>{fmtFCFA(order.total)}</span></div>
          <div className="flex justify-between text-sm text-neutral-400 pt-1"><span>Adresse</span><span className="text-right max-w-[200px]">{order.delivery_address}</span></div>
        </div>
        {isDelivered && (
          <div className="space-y-3">
            <Link href="/" className="btn-primary w-full flex items-center justify-center gap-2"><Star size={16} /> Noter la commande</Link>
            <Link href="/" className="btn-secondary w-full flex items-center justify-center">Commander à nouveau</Link>
          </div>
        )}
        {!isDelivered && !isCancelled && <p className="text-center text-neutral-400 text-xs">Cette page se met à jour automatiquement</p>}
      </main>
    </>
  );
}
