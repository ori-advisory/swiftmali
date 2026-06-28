'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, ShoppingBag, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';
import { Navbar } from '@/components/layout/navbar';
import { useCartStore } from '@/lib/cart-store';
import { fmtFCFA, cn } from '@/lib/utils';
import { PAYMENT_METHODS, type PaymentMethod } from '@swiftmali/ui/tokens';

const DELIVERY_FEE = 500;

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart, subtotal } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('orange_money');
  const [address, setAddress] = useState('');
  const [commune, setCommune] = useState('');
  const [loading, setLoading] = useState(false);

  const sub = subtotal();
  const total = sub + DELIVERY_FEE;

  async function handleCheckout() {
    if (!address || !commune) { toast.error('Veuillez renseigner votre adresse de livraison'); return; }
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, paymentMethod, deliveryAddress: address, deliveryCommune: commune, deliveryFee: DELIVERY_FEE }),
      });
      const data = await res.json() as { orderId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors de la commande');
      clearCart();
      router.push(`/track/${data.orderId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (<><Navbar /><main className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center"><ShoppingBag size={64} className="text-neutral-200 mb-6" /><h1 className="font-display font-bold text-2xl text-neutral-950 mb-2">Votre panier est vide</h1><p className="text-neutral-400 mb-8">Ajoutez des plats depuis vos restaurants préférés</p><Link href="/" className="btn-primary">Parcourir les restaurants</Link></main></>);
  }

  return (
    <>
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="btn-ghost p-2"><ArrowLeft size={20} /></Link>
          <h1 className="font-display font-bold text-2xl text-neutral-950">Votre panier</h1>
        </div>
        <div className="space-y-6">
          <div className="card divide-y divide-neutral-100">
            <div className="p-4 flex items-center justify-between">
              <span className="font-display font-semibold text-neutral-950">{items[0]?.restaurantName}</span>
              <button onClick={clearCart} className="text-red-500 text-xs hover:underline flex items-center gap-1"><Trash2 size={13} /> Vider</button>
            </div>
            {items.map((item) => (
              <div key={item.id} className="p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-950 text-sm">{item.name}</p>
                  <p className="text-neutral-400 text-xs mt-0.5">{fmtFCFA(item.price)} / unité</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center"><Minus size={13} /></button>
                  <span className="font-display font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-lg bg-gold-400 hover:bg-gold-600 flex items-center justify-center"><Plus size={13} /></button>
                </div>
                <span className="font-display font-bold text-sm text-neutral-950 w-24 text-right">{fmtFCFA(item.price * item.quantity)}</span>
                <button onClick={() => removeItem(item.id)} className="text-neutral-400 hover:text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            ))}
          </div>
          <div className="card p-4 space-y-3">
            <h2 className="font-display font-semibold text-neutral-950">Adresse de livraison</h2>
            <select value={commune} onChange={(e) => setCommune(e.target.value)} className="input">
              <option value="">Choisir une commune</option>
              {['I','II','III','IV','V','VI'].map((c) => <option key={c} value={c}>Commune {c}</option>)}
            </select>
            <input type="text" placeholder="Rue, quartier, repère (ex: Hamdallaye, rue 48)" value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
          </div>
          <div className="card p-4 space-y-3">
            <h2 className="font-display font-semibold text-neutral-950">Mode de paiement</h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((pm) => (
                <button key={pm.id} onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                  className={cn('w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-150', paymentMethod === pm.id ? 'border-gold-400 bg-gold-50' : 'border-neutral-200 hover:border-neutral-300')}>
                  <span className="text-2xl">{pm.icon}</span>
                  <div><p className="font-medium text-neutral-950 text-sm">{pm.label}</p><p className="text-neutral-400 text-xs">{pm.sub}</p></div>
                  {paymentMethod === pm.id && <div className="ml-auto w-4 h-4 rounded-full bg-gold-400 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-neutral-950" /></div>}
                </button>
              ))}
            </div>
          </div>
          <div className="card p-4 space-y-2">
            <h2 className="font-display font-semibold text-neutral-950 mb-3">Récapitulatif</h2>
            <div className="flex justify-between text-sm text-neutral-700"><span>Sous-total</span><span>{fmtFCFA(sub)}</span></div>
            <div className="flex justify-between text-sm text-neutral-700"><span>Frais de livraison</span><span>{fmtFCFA(DELIVERY_FEE)}</span></div>
            <div className="flex justify-between font-display font-bold pt-2 border-t border-neutral-100"><span>Total</span><span>{fmtFCFA(total)}</span></div>
          </div>
          <button onClick={handleCheckout} disabled={loading || !address || !commune} className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-base">
            {loading ? <span className="inline-block w-5 h-5 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" /> : <><ShoppingBag size={18} />Confirmer la commande · {fmtFCFA(total)}</>}
          </button>
        </div>
      </main>
    </>
  );
}
